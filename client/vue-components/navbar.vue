<!-- Created by Duncan on 12.28.2016 -->
<template>
  <nav class="navbar navbar-fixed-top">
    <div class="left-nav">
    </div>
    <div class="title">
      <p>Untitled</p>
    </div>
    <div class="avatar-area">
      <!-- can change fullname to image.//size throws an error however it is working?! -->
      <avatar fullname="Duncan Nevin" color="rgb(0, 0, 0)" size="20"></avatar>
    </div>
    <div class="audio">
      <audiocomponent id="audio" ></audiocomponent>
    </div>
  </nav>
</template>

<script>
  import Avatar from 'vue-avatar-component'
  import Audiocomponent from './audio_component.vue'
  import Methods from '../js/navbar.js'
  // HTTP calls ect.
  import Utils from '../js/utils.js'
  export default {
    created() {},
    components: { Avatar, Audiocomponent },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style>
  .navbar{
    display: table;
    z-index: 0;
    background-color: rgb(24, 24, 24);
    height: 8em;
    width: 100vw;
    border: transparent;
  }
  .title{
    display: table-cell;
    height: 100%;
    color: rgb(255, 255, 255);
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
  }
  .avatar-area{
    display: table-cell;
    text-align: right;
    vertical-align: middle;
    padding-right: 2em;
  }
  .avatar{
    cursor: pointer;
  }
  .glyphicon{
    color: rgb(255, 255, 255);
  }
  .left-nav{
    position: relative;
    display: table-cell;
    height: 100%;
    width: 30vw;
  }
</style>
