import Utils from '../js/utils.js'

import auth from '../js/auth.js'
import docsave from '../js/docsave.js'
import editor from '../js/editor.js'

module.exports = {
  wsSend() {
    this.ws.send(this.input);
  },

  // On each keyup counts amount of words on document
  wordCounter() {
    let splitIt = this.input.split(' ');
    // filters out spaces on each 'delete' or 'spacebar' or 'enter' key up then returns the length.
    this.count = splitIt.filter(val => val !== '').length;
  },

  // Function opens websocket with unique ID
  shareChannel(cb) {
    Utils.fetchChannel((response) => {
      this.ws = new WebSocket('ws://' + window.location.host + '/ws/' + response.body);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        // console.log('in this.ws.onmessage',e.data)
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
        // Callback changes the url in the browser
        cb(response.body);
      };
    });
  }
}
