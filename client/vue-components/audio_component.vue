<template>
  <div class="audioref" >
    <a @click="basketball()">
      <audio loop id="basketball" src="/client/assets/audio/Stomp-Basketballs.mp3"></audio>
      <img src="/client/assets/images/black-basketball3.svg" id="bballplay" />
      <img class="audioControl" src="https://i0.wp.com/www.rnningfool.com/wp-content/uploads/2014/07/pause_lead_flow.gif" id="pause" />
    </a>

    <a @click="fire()">
      <audio loop id="fire" src="/client/assets/audio/Campfire_sound_ambience.mp3"></audio>
      <img src="/client/assets/images/pretty.svg" id="fireplay" />
      <img class="audioControl" src="https://i0.wp.com/www.rnningfool.com/wp-content/uploads/2014/07/pause_lead_flow.gif" id="pause" />
    </a>

    <a @click="flute()">
      <audio loop id="flute" src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Hymne_delphique.ogg"></audio>
      <img src="/client/assets/images/flute.svg" id="fluteplay" />
      <img class="audioControl" src="https://i0.wp.com/www.rnningfool.com/wp-content/uploads/2014/07/pause_lead_flow.gif" id="pause" />
    </a>

    <a @click="square()">
      <audio loop id="square" src="/client/assets/audio/White.mp3"></audio>
      <img src="/client/assets/images/square.svg" id="squareplay" />
      <img class="audioControl" src="https://i0.wp.com/www.rnningfool.com/wp-content/uploads/2014/07/pause_lead_flow.gif" id="pause" />
    </a>

    <a @click="forest()">
      <audio loop id="forest" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Calling_of_Cicads_on_Ko_Tao%2C_Thailand_1.ogg"></audio>
      <img src="/client/assets/images/sin.svg" id="forestplay" />
      <img class="audioControl" src="https://i0.wp.com/www.rnningfool.com/wp-content/uploads/2014/07/pause_lead_flow.gif" id="pause" />
    </a>

    <a @click="eye()">
      <audio loop id="eye" src="/client/assets/audio/Growth-Mindset-Hypnosis.mp3"></audio>
      <img src="/client/assets/images/eye.svg" id="eyeplay" />
      <img class="audioControl"  id="pause" />
    </a>
</div>
</template>

<script>
export default {
  created() {
    // var yourAudio = document.getElementById('yourAudio'),
    // // ctrl = document.getElementById('audioControl'),
    // // playButton = document.getElementById('play'),
    // // pauseButton = document.getElementById('pause');
    // console.log('inplay', this.yourAudio)
    //       // if (this.yourAudio.paused) {
    //           this.yourAudio.play();
  },
  data() {
    return {
      yourAudio: document.getElementById('yourAudio'),
      playButton: document.getElementById('play'),
      pauseButton: document.getElementById('pause'),
      ctrl: document.getElementById('audioControl')
    }
  },
  methods: {
    toggleButton() {
        if (this.playButton.style.display === 'none') {
            this.playButton.style.display = 'block';
            this.pauseButton.style.display = 'none';
        } else {
            this.playButton.style.display = 'none';
            this.pauseButton.style.display = 'block';
        }
    },

    flute() {
      var flute = document.getElementById('flute'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('fluteplay'),
      pauseButton = document.getElementById('flutepause');
      flute.paused ? flute.play() : flute.pause();
      this.toggleButton();
      return false;
    },

    basketball() {
      var basketball = document.getElementById('basketball'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('bballplay'),
      pauseButton = document.getElementById('bballpause');
      basketball.paused ? basketball.play() : basketball.pause();
      this.toggleButton();
      return false;
    },
    fire() {
      var fire = document.getElementById('fire'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('fireplay'),
      pauseButton = document.getElementById('firepause');
      fire.paused ? fire.play() : fire.pause();
      this.toggleButton();
      return false;
    },
    forest() {
      var forest = document.getElementById('forest'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('forestplay'),
      pauseButton = document.getElementById('forestpause');
      forest.paused ? forest.play() : forest.pause();
      this.toggleButton();
      return false;
    },
    square() {
      var square = document.getElementById('square'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('squareplay'),
      pauseButton = document.getElementById('squarepause');
      square.paused ? square.play() : square.pause();
      this.toggleButton();
      return false;
    },
    eye() {
      var eye = document.getElementById('eye'),
      ctrl = document.getElementById('audioControl'),
      playButton = document.getElementById('eyeplay'),
      pauseButton = document.getElementById('eyepause');
      eye.paused ? eye.play() : eye.pause();
      this.toggleButton();
      return false;
    }
  }
}
</script>

<style>
.audioref img {
    height: 30px;
}

#pause {
    display: none;
}
</style>
