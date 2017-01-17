import auth from './auth.js'
import editor from '../js/editor.js'

const USER_URL = 'https://127.0.0.1:8443';

export default {
  docData: {
    currentDoc: {
      name: '',
      doc: ''
    },
    docs: [], // array of --> {name: 'docname', id: '932ejwocnodmcl'}
  },

  sendDoc(context, data) {
    context.$http.post(`${USER_URL}/db/docs`, data)
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        let fix = auth.encrypt(data.doc);
        this.docData.currentDoc = {
          id: data.id,
          name: data.name,
          doc: fix
        }
        let saved = {
          name: data.name,
          id: data.id
        }
        this.docData.docs.push(saved);
      })
      .catch((err) => {
        throw err;
      });
  },

  getAllDocs(context, username) {
    context.$http.get(`${USER_URL}/db/docs`, {params: {'username': username}})
      .then((res) => {
        let data = res.body;
        data.forEach((obj) => {
          let storedData = {
            id: obj.id,
            name: obj.name
          }
          this.docData.docs.push(storedData);
        });
      })
      .catch((err) => {
        console.error('No saved docs')
      });
  },

  getDoc(context, id) {
    context.$http.get(`${USER_URL}/db/docs`, {params: {'id': id}})
      .then((res) => {
        let data = res.body;
        let fix = auth.decrypt(data[0].doc);
        this.docData.currentDoc = {
          id: data[0].id,
          name: data[0].name,
          doc: fix
        }
        editor.changeQuill(fix);
      })
      .catch((err) => {
        console.error(err)
      });
  },

  updateDoc(context, data) {
    context.$http.put(`${USER_URL}/db/docs`, data)
      .then((res) => {
        let data = res.body;
        let fix = auth.encrypt(data[0].doc);
        this.docData.currentDoc = {
          id: data[0].id,
          name: data.name,
          doc: fix
        }
      })
      .catch((err) => {
        console.error(err)
      });
  },

  fixDups(doc) {
    let count = 0;
    let docName = doc.name.split('(')[0];
    this.docData.docs.forEach((obj) => {
      let objName = obj.name.split('(')[0];
      if (objName === docName) {
        count++;
      }
    });
    doc.name = `${doc.name}(${count+1})`
    return doc;
  }
}
