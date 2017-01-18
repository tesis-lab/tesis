<template>
  <div class="main-content">
    <navbar></navbar>
    <div class="content">

    <div class="content-left">
      <videocomponent id="video" :wsrtc="wsrtc" :uri="uri"></videocomponent>
      <div class="doc-info" v-if="count > 0">
        <div>{{ count }} words</div>
        <div>{{ time }} read</div>
      </div>
      <div class="audio">
        <audiocomponent id="audio" ></audiocomponent>
      </div>
    </div>

    <div class="content-right">
      <div id="editor"></div>
    </div>

  </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import Methods from '../js/main_content.js'
  import Videocomponent from './video_component.vue'
  import Audiocomponent from './audio_component.vue'
  import Utils from '../js/utils.js'
  import {textStats, docSubscribe} from '../js/editor.js'
  import sharedb from 'sharedb/lib/client'
  import richText from 'rich-text'
  import Quill from 'quill'
  import Chance from 'chance'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import editor from '../js/editor.js'

  export default {
    created() {
      let chance = new Chance()
      let c = this.$route.params.channel
      this.uri = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5})
      //create rtc websocket
      this.wsrtc = new WebSocket(`wss://${window.location.host}/ws/${this.uri}rtc`);

      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', this.uri);
    },
    mounted() {
      sharedb.types.register(richText.type)
      let socket = new WebSocket(`ws://${window.location.hostname}:3000/${this.uri}`)
      const connection = new sharedb.Connection(socket)

      // For testing reconnection
      window.disconnect = function() {
        connection.close();
      }
      window.connect = function(uri) {
        let socket = new WebSocket(`ws://${window.location.host}`);
        connection.bindToSocket(socket);
      }
      // Storing doc inside editor for access in other components.
      editor.doc = connection.get('docs', this.uri);
      // New quill
      editor.makeQuill();
      editor.quillOn(editor.doc);
      editor.docSubscribe(editor.quill, editor.doc);
      editor.changeQuill('');
    },

    data() {
      return {
        ws: null,
        wsrtc: null,
        wsScreen: null,
        channel: '',
        count: 0,
        // User data stored in auth
        user: auth.user,
        // Doc data stored in docsave
        docData: docsave.docData,
        time: '',
        quill: editor.quill,
        URI: ''
      }
    },
    components: {
      Navbar,
      Videocomponent,
    },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style scoped>
.main-content{
  width: 100vw;
}
.content{
  display: inline-flex;
  height: 87vh;
  width: 100vw;
}
.content-right{
  width: 80%;
}
.content-left{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.doc-info{
  font-size: 0.95em;
  font-weight: 600;
  margin: 0.75em;
  opacity: 0.35;
}
html, body{
  color: #333;
  font-family: 'Monaco', courier, monospace;
}
#editor {
  height: 100%;
}
code {
  color: #f66;
}
</style>
