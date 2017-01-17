package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

type Sessions struct {
  Id bson.ObjectId `json:"id" bson:"id,omitempty"`
  UserId string `json:"userid" bson:"userid,omitempty"`
  Id_Token string `json:"id_token" bson:"id_token"`
  LoginTime int64 `bson: "logintime"`
  LastSeenTime int64 `bson: "lastlogintime"`
}

func CreateSession(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("sessions")
  var u Sessions
  u.Id = bson.NewObjectId()
  err = json.NewDecoder(r.Body).Decode(&u)
  if err != nil {
    w.WriteHeader(404)
    return
  }
  index := mgo.Index{
    Key:        []string{"userid"},
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
    c.Find(bson.M{"userid": u.UserId}).One(&u)
    w.WriteHeader(200)
  } else {
    w.WriteHeader(201)
  }
  uj, _ := json.Marshal(u)
  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, "%s", uj)
}

func GetSessions(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()
  c := session.DB("tesis").C("sessions")
  var results []Sessions
  err = r.ParseForm()
  if err != nil {
    return
  }

  if _, ok := r.Form["userid"]; ok {
    // ?id=1234567ythgfd!
    err = c.Find(bson.M{"userid": r.Form.Get("userid")}).All(&results)
    if err != nil {
      w.WriteHeader(404)
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
