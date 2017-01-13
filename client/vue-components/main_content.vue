<!-- Created by Duncan on 12.28.2016 -->
<template>
  <div class="main-content">
    <navbar></navbar>
    <div>
    <ToolBar :word-count="count"></ToolBar>
    <!-- area to add live data as text is being added -->
    <div class="content-left"  v-if="duncanisnoton">
      <VideoComponent id="video" :wsRTC="wsRTC" :answer="answer"></VideoComponent>
    </div>
    <!-- end live data area -->
    <!-- text field -->
    <div class="content-right">
      <!-- Markdown editor -->
      <!-- Doesn't really compile markdown yet -->
      <div id="editor">
        <textarea id="content" :value="input" @input="update" @input.ws-send="wsSend" @keyup.delete="wordCounter" @keyup.space="wordCounter" @keyup.enter="wordCounter(true)"></textarea>
      </div>
      <!-- end editor -->
    </div>
    <!-- end text field -->
  </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import ToolBar from './tool_bar.vue'
  import Methods from '../js/main_content.js'
  import VideoComponent from './video_component.vue'
  // HTTP calls ect.
  import Utils from '../js/utils.js'
  import Chance from 'chance'
  const chance = new Chance()

  export default {
    created() {
      // get params from URL (if provided)
      let c = this.$route.params.channel;
      // set URI to params or generated 5 char unique.
      let URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5});
      // create websocket with unique address.
      this.ws = new WebSocket(`wss://${window.location.host}/ws/${URI}`);
      //create RTC websocket
      this.wsRTC = new WebSocket(`wss://${window.location.host}/ws/${URI}rtc`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', URI);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
      }
    },

    data() {
      return {
        // URI: c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5}),
        ws: null,
        wsRTC: null,
        answer:'',
        input: '',
        channel: '',
        count: 0,
        channel: '',
        duncanisnoton: false
      }
    },
    components: {
      ToolBar,
      Navbar,
      VideoComponent
    },
    // Methods are located in js directory
    methods: Methods,
  }
</script>

<style>
  .main-content{
    width: 100vw;
  }
  .content-right{
    border: 1px solid transparent;
    margin-left: 30vw;
    width: 70vw;
    height: 100vh;
  }
  .content-left{
    position: fixed;
    width: 30vw;
  }
  html, body, #editor {
    margin: 0;
    height: 100%;
    color: #333;
    font-family: 'Monaco', courier, monospace;
  }
  textarea, #editor div {
    display: inline-block;
    width: 100%;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
  }
  textarea {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    padding: 20px;
  }
  code {
    color: #f66;
  }
</style>