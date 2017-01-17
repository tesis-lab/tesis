<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <transition name="fade" mode="in-out">
        <form @submit.prevent="onSubmit">
          <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
          <input type="text" class="form-control email-password" placeholder="Email" v-model="credentials.email">
          <input type="password" class="form-control email-password" placeholder="Password" v-model="credentials.password">
          <input type="submit" class="form-control submit" value="Submit"><input type="button" class="form-control submit" value="<<Back" @click="showNone()">
        </form>
      </transition>
      <div class="alert alert-danger" v-if="error">
        <p> {{ error }} </p>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from '../js/auth.js'

  export default {
    data(){
      return {
        credentials: {
          username: '',
          email: '',
          password: '',
          avatar: ''//for future
        },
        error: '',
        loggingin: true
      }
    },
    created() {
    },
    methods: {
      // Bob1! --> sample username
      // bob@me.com --> sample email
      // FishyTreat1! --> sample password
      onSubmit() {
        let credentials = {
          username: this.credentials.username.trim(),
          email: this.credentials.email.trim(),
          password: this.credentials.password.trim(),
          avatar: this.credentials.avatar,
          membersince: Date.now()
        };
        if (!auth.verifyUsername(credentials.username)) {
          this.error = 'Must contain at least one symbol';
          return;
        }
        if (!auth.verifyEmail(credentials.email)) {
          this.error = 'Invalid email';
          return
        }
        if (!auth.verifyPassword(credentials.password)) {
          this.error = 'Password must be 8 characters with least 1 Alphabet, 1 Number and 1 Special Character'
          return
        }
        auth.signup(this, credentials, status => this.showNone());
      }
    },
    props: ['showNone'] 
  }
</script>

<style>
  .panel{
    background-color: transparent;
    z-index: 1;
  }
  .panel-body{
    padding: 0;
  }
  .panel, .form-control{
    border-radius: 0px;
    margin: 0;
  }
  .submit, .email-password{
    width: 50%;
  }
  input{
    float: right;
    background-color: rgb(0, 0, 0);
  }
  input[type="text"], input[type="password"], input[type="submit"]{
    background-color: rgb(0, 0, 0);
    color: rgb(246, 246, 246);
  }
</style>