<!-- Created by Duncan on 12.28.2016 -->
<template>
  <div class="main-content">
    <navbar></navbar>
    <ToolBar :word-count="count"></ToolBar>
    <!-- area to add live data as text is being added -->
    <div class="content-left">
      <p>This area is for live data about text</p>
      <p>To see tools hover over tools or far left on screen</p>
    </div>
    <!-- end live data area -->
    <!-- text feild -->
    <div class="content-right">
      <!-- Markdown editor -->
      <!-- Doesn't really compile markdown yet -->
      <div id="editor">
        <textarea id="content" :value="input" @input="update" @input.ws-send="wsSend" @keyup.delete="wordCounter" @keyup.space="wordCounter" @keyup.enter="wordCounter(true)"></textarea>
      </div>
      <!-- end editor -->
    </div>
    <!-- end text feild -->
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import ToolBar from './tool_bar.vue'
  import Methods from '../js/main_content.js'
  // HTTP calls ect.
  import Utils from '../js/utils.js'

  export default {
    created() {
      // Url entered in browser.
      let path = window.location.href.split('#');
      this.shareChannel((url) => {
        this.channel = url;
        window.history.pushState(path[0], '/', this.channel);
      });
    },
    data() {
      return {
        ws: null,
        input: '',
        channel: '',
        count: 0,
        channel: ''
      }
    },
    components: {
      ToolBar,
      Navbar
    },
    // Methods are located in js directory
    methods: Methods
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
