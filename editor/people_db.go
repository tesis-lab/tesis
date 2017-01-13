package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

type People struct {
  Id bson.ObjectId `json:"id" bson:"id,omitempty"`
  UserName string `json:"username" bson:"username"`
  Email string `json:"email" bson:"email"`
  Password string `json:"password" bson:"password"`
  Avatar string `json:"avatar" bson:"avatar"`
}

// CreateUser creates a new user resource
func CreateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  var u People
  u.Id = bson.NewObjectId()
  err = json.NewDecoder(r.Body).Decode(&u)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  index := mgo.Index{
    Key:        []string{"username"},
    Unique:     true,
    DropDups:   true,
    Background: true,
    Sparse:     true,
  }
  err = c.EnsureIndex(index)
  if err != nil {
    return
  }
  err = c.Insert(u)
  if err != nil {
    c.Find(bson.M{"username": u.UserName}).One(&u)
    w.WriteHeader(200)
  } else {
    w.WriteHeader(201)
  }
  uj, _ := json.Marshal(u)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", uj)
}

// GetUser gets a user resource
func GetUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {

    w.WriteHeader(404)
    return
  }
  defer session.Close()
  c := session.DB("tesis").C("people")
  var results []People
  err = r.ParseForm()
  if err != nil {
    return
  }
  if _, ok := r.Form["id"]; ok {
    // ?id=1234567ythgfd!
    fmt.Println(r.Form)
    err = c.Find(bson.M{"id": bson.ObjectIdHex(r.Form.Get("id"))}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.WriteHeader(200)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, "%s", uj)
    return
  } else if _, ok := r.Form["username"]; ok {
  // Params -->  ?username=Sally123!
    err = c.Find(bson.M{"username": r.Form.Get("username")}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.WriteHeader(200)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, "%s", uj)
    return
  } else {
  // No params
    err = c.Find(bson.M{}).Sort("-timestamp").All(&results)
    if err != nil {
      w.WriteHeader(404)
      return
    }
    uj, _ := json.Marshal(results)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    fmt.Fprintf(w, "%s", uj)
    return
  }
}

// UpdateUser updates users personal information
func UpdateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  var d People
  err = json.NewDecoder(r.Body).Decode(&d)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  err = c.Update(bson.M{"id": d.Id}, bson.M{"id": d.Id, "username": d.UserName, "email": d.Email, "password": d.Password, "avatar": d.Avatar})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  uj, _ := json.Marshal(d)
  w.WriteHeader(200)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", uj)
}

// DeleteUser deletes entire user resource
func DeleteUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  var d People
  if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
    w.WriteHeader(404)
    return
  }
  err = c.Remove(bson.M{"id": d.Id})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  w.WriteHeader(200)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "User removed Successfully!")
}










