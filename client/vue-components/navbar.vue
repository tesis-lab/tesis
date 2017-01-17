<template>
  <nav class="navbar navbar-fixed-top">
    <div class="left-nav">
    </div>
    <div class="title" v-if="this.user.authenticated">
      <p> {{ docData.currentDoc.name || 'New' }} </p>
    </div>
      <!-- Authentication -->
      <div class="auth-area" v-if="!this.user.authenticated">
        <Signin v-if="isLoginShowing" :show-none="showNone"></Signin>
        <Signup v-if="isSignupShowing" :show-none="showNone"></Signup>
        <div class="signup-signin">
          <button class="signup" @click="showSignup()">Signup</button><button class="signin" @click="showSignin()">Signin
          </button>
        </div>
      </div>
    <div class="right-nav" v-if="this.user.authenticated">
      <!-- can change fullname to image.//size throws an error however it is working?! -->
      <div @click="showControls()">
        <avatar class="user-details" v-bind:fullname="user.data.username" color="rgb(0, 0, 0)" size=40></avatar>
      </div>

      <!-- hidden control panel -->
      <div class="user-stuff panel-body" v-if="this.showControl">
        <!-- logout button -->
        <div class="signout-container panel-heading">
          <button class="control-buttons signout fixed-top" @click="logout()">Signout</button>
          <button class="control-buttons" @click="showControls()">Close</button>
        </div>
        <!-- end logout button -->
        <!-- saved documents list -->
        <div class="saved">
          <div class="saved-docs">
              <button v-for="item in docData.docs" :id="item.id" @click="uploadDoc($event.target.id)">
                {{ item.name }}
              </button>
          </div>
          <!-- Save buttons -->
          <div class="save" v-if="this.user.authenticated">
            <button @click="saveAs(saveDoc)">Save As</button>
            <button @click="save()" v-if="docData.currentDoc.doc">Save</button>
            <button @click="newDoc()">New</button>
          </div>
          <!-- end Save buttons -->
          <!-- end saved documents list -->
        </div>
        <!-- end hidden control panel -->

      </div>
    </div>
  </nav>
</template>

<script>
  import Avatar from 'vue-avatar-component'
  import Methods from '../js/navbar.js'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import Signin from './signin.vue'
  import Signup from './signup.vue'

  export default {
    created() {
    },
    data() {
      return {
        user: auth.user,
        docData: docsave.docData,
        showControl: false,
        isLoginShowing: false,
        isSignupShowing: false
      }
    },
    components: {
      Avatar,
      Signin,
      Signup
    },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style>
  .navbar{
    color: white;
    display: table;
    background-color: rgb(24, 24, 24);
    height: 8em;
    width: 100vw;
    border: transparent;
  }
  .title{
    color: rgb(255, 255, 255);
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
  }
  .title, .right-nav{
    text-align: center;
    vertical-align: middle;
  }
  .left-nav, .right-nav, .title{
    display: table-cell;
    height: 100%;
    width: 33.33vw;
  }
  .user-details{
    float: right;
    margin-right: 1em;
  }
  .avatar{
    cursor: pointer;
  }
  .glyphicon{
    color: rgb(255, 255, 255);
  }
  .user-stuff{border: 1px solid white;
    position: fixed;
    top: 0;
    right: 0;
    width: 30vw;
    min-height: 8em;
    background-color: rgb(24, 24, 24);
    /*overflow: auto;*/
  }
  .saved{border: 1px solid white;
    width: 100%;
    padding-top: 3em;
    min-height: 100%;
    /*overflow: scroll;*/
  }
  .signout-container{
    position: fixed;
    top: 0;
    width: 30vw;
  }
  .control-buttons, .saved-docs button{
    background-color: rgb(24, 24, 24);
  }
  .control-buttons{
    display: inline-block;
    width: 40%;
  }
  .save button{
    color: black;
  }
  .signup-signin{
  width: 100%;
  display: table;
  position: absolute;
  top: 2.25em;
  }
  .signup, .signin{
    width: 50%;
    display: table-cell;
    background-color: transparent;
    border: none;
    color: rgb(255, 255, 255);
    outline: none;
  }
  .signup-signin button{
    color: white;
    text-decoration: none;
  }
  .signup-signin button:hover{
    cursor: pointer;
    -moz-box-shadow: 0 0 60px rgb(246, 246, 246);
    -webkit-box-shadow: 0 0 60px rgb(246, 246, 246);
    box-shadow: 0 0 60px rgb(246, 246, 246);
  }
  .auth-area{
    position: fixed;
    width: 25vw;
    height: 4em;
    right: 0;
    top: 0.5em;
  }
</style>
