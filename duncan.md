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

#### People

*   Path - "/db/user"
    * POST --> Add a user resource to People table
        * body -
            *   {
            *   "username": "Sally",
            *   "email": "sally@me.com",
            *   "password": "1234435wefdsgg",
            *   "avatar": "whaereve.jpg"
            *   }

            *   Response -
                *   New entry -

                *   Code 201 --> If user not in database, user will be added.
                *   User data will be returned with Id

                *   Existing user -

                *   Code 200 --> If user already in database, user will not be added.
                *   User data will be returned with Id

    * GET --> Get a user resource from the People table
        *   Query strings-
            *   ?id=58758a6a42f5bf588cb1bc1f --> returns user resource
            *   ?username=Sally --> returns users resource
            *   No parameters --> returns all user resources

        *   Response -
            *   code 200
            *   User resource

    * PUT --> Alter a user resource from the People table
        *   body -
            *   {
            *   "id": "23lw,.,n213eqwljd",
            *   "username": "Sally",
            *   "email": "sally@me.com",
            *   "password": "1234435wefdsgg",
            *   "avatar": "whaereve.jpg"
            *   }
        *   Response -
            *   code 201
            *   Updated user resouces.
    * DELETE --> Delete a user resource from the People table
        *   body -
            *   {
            *   "id": "243rewfgfrd!3erf"
            *   }
        *   Response -
            *   code 201

*   Path - "/db/docs"
    * POST --> Add a document to the Documents table
        * body -
            *   {
            *   "username": "Sally",
            *   "email": "sally@me.com",
            *   }

            *   Response -
                *   Code 201
                *   Document data will be returned with id

    * GET --> Get a document from the Documents table
        *   Query strings-
            *   ?id=58758a6a42f5bf588cb1bc1f --> finds a specific document
            *   ?username=Sally --> finds all documents associated with this user
            *   No parameters --> returns all documents in table

        *   Response -
            *   code 200
            *   Document resource

    * PUT --> Alter a document in the Documents table
        *   body -
            *   {
            *   "id": "58772de442f5bf80370c1389",
            *   "username": "sally",
            *   "doc": "ddddddd"
            *   }
        *   Response -
            *   code 201
            *   Updated document resource
    * DELETE --> Remove a document from the Documents table
        *   body -
            *   {
            *   "id": "243rewfgfrd!3erf"
            *   }
        *   Response -
            *   code 201

* * *
