package main

import (
    //install with go get golang.org/x/crypto/bcrypt
    //https://godoc.org/golang.org/x/crypto/pbkdf2 this is faster but uses Sha
    "golang.org/x/crypto/bcrypt"
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

func bcryptit(pw string) string {
    plaintext := []byte(pw)

    // Hashing the plaintext cost of 12
    hashedPassword, err := bcrypt.GenerateFromPassword(plaintext, MedCost)
    if err != nil {
        panic(err)
    }

    return string(hashedPassword)
}

func decryptit(pw string, pt string) string {

    plaintext := []byte(pt)
    hashedPassword := []byte(pw)

    // Comparing hash to plaintext
    err := bcrypt.CompareHashAndPassword(hashedPassword, plaintext)
    if err == nil {
        return "Valid"
    } else {
        return "Invalid"
    }
}