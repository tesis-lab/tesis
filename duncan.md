# Duncan's notes

* * *

### Global install

1.  karma-cli
2.  jasmine
3.  webpack
4.  browserify
5.  watchify

* * *

### Dependancies

1.  npm install

* * *

### Start server

1.  Checkout Neville.md

* * *

### Start Webpack

1.  run -> webpack -w

* * *

### Test

1.  run -> karma start
2.  go to http://localhost:9876/debug.html
3.  tests run inside the console.

* * *

### Data Base

#### POST

There are three POST requests, each with different paths and body data.

"/db" is for adding new users and for authentication. If the user exists already in the db the response will be the users data from the db with a code of 200\. If the user is not found they will be added and the response will include the added data with a code of 201.

"/db/addfile" is for adding saved documents to the users profile. Currently files can be duplicated, I plan to handle this on the front end by adding (2) to the file if there is a duplicate.

"/db/deletefile" is for removing individual documents based on the name of the document.

*   Path - "/db"

*   body -
    *   {
    *   "userName": "Sally",
    *   "email": "sally@me.com",
    *   "password": "1234435wefdsgg",
    *   "avatar": "whaereve.jpg"
    *   }
*   response -
    *   New entry -

    *   Code 201
    *   Users entered data

    *   Existing user -

    *   Code 200
    *   User data from Database

*   Path - "/db/addfile"

*   body -
    *   {
    *   "id": "12334567898765",
    *   "file": "sallys.txt"
    *   }

*   response -
    *   Successful -

    *   Code 201

    *   Failed -

    *   Code 401

*   Path - "/db/deletefile"

*   body -
    *   {
    *   "id": "324563743567",
    *   "file": "sallys.txt"
    *   }

*   response -
    *   Successful -

    *   Code 200

    *   Failed -

    *   Code 401

#### GET

"/db" get request can take three different types of parameters

"?id=58758a6a42f5bf588cb1bc1f" will find the user with the associated id. The response will include all the users data, inluding all saved documents.

"?username=Sally" will find the user with the associated username. The response will include all the users data, inluding all saved documents.

No parameters will return the entire "people" table.

*   Path - "/db"

*   parameters -
    *   ?id=58758a6a42f5bf588cb1bc1f --> returns all data associated with this id
    *   ?username=Sally --> returns all data associated with this username
    *   No parameters --> returns all users
    *   Returned data -
        *   {
        *   "id": "58758a7f42f5bf588cb1bc20",
        *   "userName": "Sally",
        *   "email": "sally@me.com",
        *   "password": "1234435wefdsgg",
        *   "avatar": "whaereve.jpg"
        *   "saved": ["text.txt", "text.txt(2)"]
        *   }

*   response -
    *   Successful -

    *   Code 200

    *   Failed -

    *   Code 401

#### PUT

"/db" put request will change alter the user data associated with the id. It is important to send the entire body for each put request.

*   Path - "/db"

*   body -
    *   {
    *   "id": "58758a7f42f5bf588cb1bc20",
    *   "userName": "Sally",
    *   "email": "sally@me.com",
    *   "password": "1234435wefdsgg",
    *   "avatar": "whaereve.jpg"
    *   }

*   response -
    *   Successful -

    *   Code 201

    *   Failed -

    *   Code 401

#### DELETE

"/db" delete will delete the user data associated with the id.

*   Path - "/db"

*   body -
    *   {
    *   "id": "58758a7f42f5bf588cb1bc20",
    *   "userName": "Sally",
    *   }

*   response -
    *   Successful -

    *   Code 200

    *   Failed -

    *   Code 401

* * *