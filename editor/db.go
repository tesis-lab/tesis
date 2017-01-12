package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)
/* ======>User Schema<====== */
type(
  User struct {
    Id bson.ObjectId `json:"id" bson:"id,omitempty"`
    UserName string `json:"username" bson:"username"`
    Email string `json:"email" bson:"email"`
    Password string `json:"password" bson:"password"`
    Avatar string `json:"avatar" bson:"avatar"`
    Saved []string `json:"saved", bson:"saved"`
  }
)
/* ======>Database Handlers<====== */

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
  // Stub a user to be populated from the body
  var u User
  // Add an id
  u.Id = bson.NewObjectId()
  // Populate the user data
  err = json.NewDecoder(r.Body).Decode(&u)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // Index creates unique identifiers to look for.
  index := mgo.Index{
    Key:        []string{"id"},
    Unique:     true,
    DropDups:   true,
    Background: true,
    Sparse:     true,
  }
  // Check if id is unique
  err = c.EnsureIndex(index)
  err = c.Insert(u)
  if err != nil {
    // If db already contains username return data w/id and status code 200
    c.Find(bson.M{"username": u.UserName}).One(&u)
    w.WriteHeader(200)
  } else {
    // If not found respond with status code 201.
    w.WriteHeader(201)
  }
  // Make response into json
  // Returns user input for use on front end
  uj, _ := json.Marshal(u)
  // Write content-type, statuscode, payload
  w.Header().Set("Content-Type", "application/json")
  // Return id for storage in session
  fmt.Fprintf(w, "%s", uj)
}

// AddFile adds a file to a Users saved array
func AddFile(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  // Input data for use in db query
  var data struct{
    Id string
    File string
  }

  if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
    w.WriteHeader(404)
    return
  }
  // Push new file data to Saved array
  err = c.Update(bson.M{"id": bson.ObjectIdHex(data.Id)}, bson.M{"$push" : bson.M{"saved": data.File}})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // If success respond with status code 201
  w.WriteHeader(201)
  // Write content-type, statuscode, payload
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "Filed Added Successfully!")
}

// RemoveFile removes a specified file from the Users saved array
func DeleteFile(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  // Input data for use in db query
  var data struct{
    Id string
    File string
  }

  err = json.NewDecoder(r.Body).Decode(&data)
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // Remove file based on file name.
  err = c.Update(bson.M{"id": bson.ObjectIdHex(data.Id)}, bson.M{"$pull" : bson.M{"saved": data.File}})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // respond with status code 201.
  w.WriteHeader(201)
  // Write content-type, statuscode, payload
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "Filed Removed Successfully!")
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

  var results []User

  err = r.ParseForm()
  if err != nil {
    return
  }

  // Removes if parameter is "id"
  if _, ok := r.Form["id"]; ok {
    // ?id=Sally123!
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
  }
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
  // Input data for use in db query
  var data struct{
    Id string
    UserName string
  }

  if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
    w.WriteHeader(404)
    return
  }
  // Removes user file based on id
  err = c.Remove(bson.M{"id": bson.ObjectIdHex(data.Id)})
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // If successful responds with status code 200
  w.WriteHeader(200)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "User removed Successfully!")
}

// UpdateUser updates users personal information
func UpdateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()
  c := session.DB("tesis").C("people")
  // Input data for use in db query
  var data struct{
    Id string
    UserName string
    Email string
    Password string
    Avatar string
  }

  if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
    w.WriteHeader(401)
    return
  }
  // Updates users personal details
  err = c.Update(bson.M{"id": bson.ObjectIdHex(data.Id)}, bson.M{
    "id": bson.ObjectIdHex(data.Id),
    "username": data.UserName,
    "email": data.Email,
    "password": data.Password,
    "avatar": data.Avatar,
  })
  if err != nil {
    w.WriteHeader(401)
    return
  }
  // If successful responds with status code 201
  w.WriteHeader(201)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", "User updated Successfully!")
}
/* <=======end Database Handlers======> */











