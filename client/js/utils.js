// Created by Duncan on 12.29.2016
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);
// Temp server address. Connnected to a mongodb for testing.
// Post(send), Put(update), and Delete(remove) data...
/*
  {
    userName: 'Sally',
    email: 'sally@me.com',
    projects: [some.txt, that.txt]
  }
*/
// Get(fetch) takes no query receives all data
// **send an empty object to delete to delete all data**

const url = 'http://127.0.0.1:1337';

module.exports = {
  fetchChannel(cb) {
    Vue.http.get('/getUrl')
    .then((res) => {
      cb(res)
    }).catch((res) => {
      throw res;
    });
  },
  // Fetches data from database
  fetch(cb) {
    Vue.http.get(url + '/db')
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  send(data, cb) {
    Vue.http.post(url + '/db', data)
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  update(data, cb) {
    Vue.http.put(url + '/db', data)
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  remove(data, cb) {
    Vue.http.delete(url + '/db', data)
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  }
};