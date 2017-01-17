import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

const url = 'https://127.0.0.1:8443';

module.exports = {
  // fetchChannel(cb) {
  //   Vue.http.get('/getUrl')
  //   .then((res) => {
  //     cb(res)
  //   }).catch((res) => {
  //     throw res;
  //   });
  // },
/*=======> Database Calls <=========*/
/* -->Checkout duncan.md for specific instructions about each call<-- */
  fetch(param, cb) {
    // Param needs to be an array --> eg ['id', '12345'] or ['username', 'Sally1!'].
    // If found response will be all user data and response code 200.
    Vue.http.get(url + '/db?' + param.join('='))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  addUser(data, cb) {
    /* data -
      {
        "userName": "Sally1!",
        "email": "sally@me.com",
        "password": "1234435wefdsgg",
        "avatar": "whaereve.jpg"
      }
    */
    // If user is already in db --> code 200, body userdata.
    // If user is added to db --> code 201, body userdata.
    Vue.http.post(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  addFile(data, cb) {
    /* data -
      {
        "id": "123245678654321",
        "file": "sallys.txt"
      }
    */
    // Success --> code 201
    // Failed --> code 401
    Vue.http.post(url + '/db/addfile', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  deleteFile(data, cb) {
    /* data -
      {
        "id": "234567543214",
        "file": "sallys.txt"
      }
    */
    // Success --> code 201
    // Failed --> code 401
    Vue.http.post(url + '/db/deletefile', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  update(data, cb) {
    /* data -
      {
        "id": "58758a7f42f5bf588cb1bc20",
        "userName": "Sally",
        "email": "sally@me.com",
        "password": "1234435wefdsgg",
        "avatar": "whaereve.jpg"
      }
    */
    // Success --> code 201
    // Failed --> code 401
    Vue.http.put(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  remove(data, cb) {
    /* data -
      {
        "id": "58758a7f42f5bf588cb1bc20",
        "userName": "Sally",
      }
    */
    // Success --> code 200
    // Failed --> code 401
    Vue.http.delete(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  }
/*<======= end Database Calls =========>*/
}

