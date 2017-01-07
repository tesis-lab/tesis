package main

import (
  "fmt"
  "net/http"
  "log"
  "github.com/gorilla/mux"
)

const (
    PORTSSL       = ":8443"
    PORTREG       = ":8000"
    PUBLIC_KEY = "./cert.pem"
    PRIV_KEY = "./key.pem"
)

// func redirectToHttps(w http.ResponseWriter, r *http.Request) {
//   // Redirect to https 127.0.0.1:8443 will only work locally
//   http.Redirect(w,r, "https://127.0.0.1:"+PORTSSL+r.RequestURI, http.StatusMovedPermanently)
// }

// func hander(w http.ResponseWriter, r *http.Request) {
//   fmt.Fprintf(w, "Hi there mover and shaker!")
// }

// handles routing
func main() {
  fmt.Println("Go server, go! (8k)")

  // run the hub to start websockets
  go h.run()

  // gorilla router
  r := mux.NewRouter()

  // websocket endpoint
  r.HandleFunc("/ws/{channel}", serveWS)

  // db methods, for when db implemented.
  // r.HandleFunc("/db", saveDoc).Methods("POST")
  // r.HandleFunc("/db", retrieveDoc).Methods("GET")
  // r.HandleFunc("/db", updateDoc).Methods("UPDATE")

  // Serve static files (make sure index has /client at start, so paths match)
  s := http.StripPrefix("/client", http.FileServer(http.Dir("client")))
  r.PathPrefix("/client").Handler(s)

  // serve index.html to root, or any path we don't recognise.
  r.HandleFunc("/", serveIndex)
  r.NotFoundHandler = http.HandlerFunc(serveIndex)

  // start 'er up.
  log.Fatal(http.ListenAndServeTLS(PORTSSL, PUBLIC_KEY, PRIV_KEY, r))
  // log.Fatal(http.ListenAndServe(":8000", http.HandlerFunc(redirectToHttps)))
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, "client/index.html")
}
