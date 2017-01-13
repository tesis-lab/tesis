package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

type Documents struct {
  Id bson.ObjectId `json:"id" bson:"id"`
  UserName string `json:"username" bson:"username"`
  Doc string `json:"doc" bson:"doc"`
}

// AddDoc adds a doc to the Documents table
func AddDoc(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("documents")
  var d Documents
  d.Id = bson.NewObjectId()
  err = json.NewDecoder(r.Body).Decode(&d)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  err = c.Insert(d)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  uj, _ := json.Marshal(d)
  w.WriteHeader(201)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", uj)
}

// GetDoc gets docs by multiple methods of filtering
func GetDoc(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("documents")
  var results []Documents
  err = r.ParseForm()
  if err != nil {
    return
  }
  if _, ok := r.Form["id"]; ok {
    // ?id=123rfvg5432edwc --> finds a specific doc by id
    err = c.Find(bson.M{"id": bson.ObjectIdHex(r.Form.Get("id"))}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    fmt.Fprintf(w, "%s", uj)
  } else if _, ok := r.Form["username"]; ok {
    // ?username=Sally123! --> finds all docs with username
    err = c.Find(bson.M{"username": r.Form.Get("username")}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    fmt.Fprintf(w, "%s", uj)
  } else {
    // no parameters returns entire collection
    err = c.Find(bson.M{}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    fmt.Fprintf(w, "%s", uj)
  }
}

// UpdateDoc updates doc
func UpdateDoc(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("documents")
  var d Documents
  err = json.NewDecoder(r.Body).Decode(&d)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  err = c.Update(bson.M{"id": d.Id}, bson.M{"id": d.Id, "username": d.UserName, "doc": d.Doc})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  uj, _ := json.Marshal(d)
  w.WriteHeader(200)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", uj)
}

// DeleteDoc deletes a doc based on id
func DeleteDoc(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("documents")
  var d Documents
  err = json.NewDecoder(r.Body).Decode(&d)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  err = c.Remove(bson.M{"id": d.Id})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  w.WriteHeader(200)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "Doc removed Successfully!")
}
