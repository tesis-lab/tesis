<template>

    <div>
      <div><video id="localVideo" @click="toggleAudioMute()" muted="true" autoplay></video></div>
      <div><video id="remoteVideo" muted="remoteMuted" autoplay></video></div>

      <div id="video-container"></div>
        <button v-show="collaborate" @click="start()" id="collaborate" >collaborate++</button>
        <button v-show="connected" @click="call()" id="connect">click to connect</button>
        <button v-show="!ourAudio" @click="toggleMute()" id="mute">unmute yourself</button>
        <button v-show="ourAudio" @click="toggleMute()" id="mute">mute yourself</button>
        <button @click="stop()" id="stop">stop sharing</button>
        <button @click="record()" id="record" >Record</button>
        <button @click="download()" id="download" >Download</button>
        <!-- <button @click="screen()" id="screen" >S</button> -->
      </div>
    <!--need to set remote videos to append to document to accomodate for multiple callers (maybe later feature?)-->
    <!--<div v-el="remoteVideo" id="remoteVideo">-->
    <!--<video id="remoteVideo" autoplay></video>-->

</template>

<style>
  video {
    display: inline-block;
    max-width: 100%;
  }
  .grayscale {
  +filter: grayscale(1);
  }
  .sepia {
    +filter: sepia(1);
  }
  .blur {
    +filter: blur(3px);
  }
</style>
<style>
  button {
    width: 100%
  }
</style>
<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {
      this.start();
      this.wsRTC.onmessage = e => {
        this.signalHandler(e)
      };
      console.log('this.remoteMuted at start', this.remoteMuted)
    },

    props: ['wsRTC','saverURI'],

    data() {
      return {
        ourAudio: true,
        videos:'',
        collaborate: true,
        connected: false,
        ourAnswer:'',
        otherSDP:'',
        iceCandidates:[],
        pc: null,
        localStream:'',
        theRecorder: null,
        recordedChuck: [],
        peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}, {'url': 'stun:stun.services.mozilla.com'}]},
      }
    },

    methods: Methods

  }
</script>