<template>

    <div>
      <div id="buttonContainer">
      <button @click="record()" id="record" >R</button>
      <button @click="download()" id="download" >D</button>
      <button @click="screen()" id="screen" >S</button>
      </div>
      <div id="video-container"></div>
      <button v-show="collaborate" @click="start()" id="collaborate" >collaborate++</button>
      <button v-show="connected" @click="call()" id="connect">click to connect</button>
      <button v-show="!ourAudio" @click="toggleMute()" id="mute">unmute yourself</button>
      <button v-show="ourAudio" @click="toggleMute()" id="mute">mute yourself</button>
      <button @click="stop()" id="stop">stop sharing</button>
    </div>


</template>

<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {

      this.gainNode();
      this.signalHandler();

    },

    props: ['wsrtc','uri'],

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

<style>
  video {
    display: inline-block;
    max-width: 100%;
  }
  button {
    width: 100%
  }
</style>
