package main

import (
    //install with go get golang.org/x/crypto/bcrypt
    //https://godoc.org/golang.org/x/crypto/pbkdf2 this is faster but uses Sha
    "golang.org/x/crypto/bcrypt"
    "fmt"
    "errors"
)

const (

    MinCost     int = 4  // the minimum allowable cost as passed in to GenerateFromPassword
    MedCost     int = 12 // the custom allowable cost as passed in to GenerateFromPassword
    MaxCost     int = 31 // the maximum allowable cost as passed in to GenerateFromPassword
    DefaultCost int = 10 // the cost that will actually be set if a cost below MinCost is passed into GenerateFromPassword
)

var ErrMismatchedHashAndPassword = errors.New("crypto/bcrypt: hashedPassword is not the hash of the given password")
var ErrHashTooShort = errors.New("crypto/bcrypt: hashedSecret too short to be a bcrypted password")

func bcryptit() {
    plaintext := []byte("Call me Ishmael. Some years ago- never mind how long precisely- having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth, whenever it is a damp, drizzly November in my soul whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I ")

    // Hashing the plaintext cost of 12
    hashedPassword, err := bcrypt.GenerateFromPassword(plaintext, MedCost)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(hashedPassword))

    // Comparing plaintext with the hash
    err = bcrypt.CompareHashAndPassword(hashedPassword, plaintext)
    fmt.Println(err) // nil means matched hash
}