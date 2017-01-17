import auth from '../js/auth.js'
import docsave from '../js/docsave.js'
import editor from '../js/editor.js'

module.exports = {
  logout() {
    this.showControls();
    auth.logout();
  },

  uploadDoc(id) {
    docsave.getDoc(this, id);
  },

  showControls() {
    this.showControl = !this.showControl;
  },

  saveAs(cb) {
  // Saves new documents to the database
    let name = prompt('name da file');
    //cb is being used to ensure saveAs is async
    cb(name)
  },

  saveDoc(name) {
  // saveDoc makes the actual call to the database with the data
    let prepDoc = {
      username: auth.user.data.username,
      name: name,
      doc: auth.encrypt(docsave.docData.currentDoc.doc)
    }
    // fixDups adds a number to the saved doc in order to ensure all docs
    // have unique names
    prepDoc = docsave.fixDups(prepDoc);
    docsave.sendDoc(this, prepDoc);
  },

  save() {
  // save updates the form that is currently loaded
    let assembleData = {
      id: docsave.docData.currentDoc.id,
      username: auth.user.data.username,
      name: docsave.docData.currentDoc.name,
      doc: auth.encrypt(docsave.docData.currentDoc.doc)
    }
    console.log(editor.quill.container.firstChild.innerHTML)
    docsave.updateDoc(this, assembleData);
  },

  newDoc() {
    docsave.docData.currentDoc = {
      name: '',
      doc: ''
    };
    editor.changeQuill('');
  },

  showSignin() {
    this.isSignupShowing = false;
    this.isLoginShowing = !this.isLoginShowing;
  },

  showSignup() {
    this.isLoginShowing = false;
    this.isSignupShowing = !this.isSignupShowing;
  },

  showNone() {
    this.isSignupShowing = false;
    this.isLoginShowing = false;
  }
}