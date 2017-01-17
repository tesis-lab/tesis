/**
 * Created by charleen on 1/6/17.
 */

module.exports = {

  gainNode() {
    let context = new AudioContext();
    let sineWave = context.createOscillator();
    // Declare gain node
    let gainNode = context.createGain();
    // Connect sine wave to gain node
    sineWave.connect(gainNode);
    // Connect gain node to speakers
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.9;
  },

  start() {
    this.startCollab();
    //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
    //which is then used in the success callback on the MediaStream object that contains the media stream
    navigator.mediaDevices.getUserMedia({ audio: {
      googAutoGainControl: false,
      echoCancellation: false
    }, video: true})
      .then (stream => {
        // set localStream equal to this stream
        this.localStream = stream
      })
      .catch(e => { console.log('getUserMedia() error: ' + e.name);});
  },

  startCollab()  {
    this.wsrtc.send(JSON.stringify({'type':'join'}));
    this.wsrtc.send(JSON.stringify({'type': 'joinUp'}))
  },

  call() {
    //call to create initial offer
    this.pc.createOffer()
      .then(offer => {
        //set local description to own SDP offer
        this.pc.setLocalDescription(offer);
        //send offer over WS signaling server
        this.wsrtc.send(JSON.stringify({'sdp': offer}))
      })
      .catch(e => { console.log('err offer setLocalDescription', e);})
  },

  gotStream(stream) {
    //set button displays
    this.collaborate = false;
    //set source of localVideo element to the stream captures from getUserMedia;
    this.videos = document.getElementById('video-container');
    let localVideo = document.createElement('video')
    this.videos.appendChild(localVideo);
    localVideo.src = URL.createObjectURL(this.localStream);
    localVideo.setAttribute("autoplay", true);
    localVideo.setAttribute("muted", true);
    localVideo.setAttribute("id", this.localStream.id);
    // instantiate new peer connection
    this.pc = new RTCPeerConnection(this.peerConnectionConfig);
    // set methods on new peer connection object
    this.pc.addStream(this.localStream)

    this.pc.onaddstream = e => {
      //event handler for setRemoteDescription: adds remote stream src to DOM
      if (!document.getElementById(e.stream.id)) {
        let otherVideo = document.createElement('video');
        //append remote video elements to video container
        this.videos.appendChild(otherVideo);
        otherVideo.src = URL.createObjectURL(e.stream);
        otherVideo.setAttribute("autoplay", true);
        otherVideo.muted = false;
        otherVideo.setAttribute("id", e.stream.id);
        //send connected signal
        this.connected = false;
        this.wsrtc.send(JSON.stringify({'type': 'connected'}));
      }
    }
    //on initial reception of icecandidates...
    this.pc.onicecandidate = e => {
      //send ice candidates over WS signaling server
      if(e.candidate != null) {
        this.wsrtc.send(JSON.stringify({'ice': e.candidate}));
        this.connected = true;
      }
    }
  },

  //toggles own mute
  toggleMute() {
    this.ourAudio = !this.ourAudio;
    let id = this.localStream.id;
    this.wsrtc.send(JSON.stringify(
      {'type': 'toggleMute',
        'id': id
      })
    )
  },

  stop() {
    this.wsrtc.send(JSON.stringify({'type':'stop', 'id': this.localStream.id}));
    //delete descriptions
    delete this.pc.localDescription;
    delete this.pc.remoteDescription;
  },

  signalHandler() {

    this.wsrtc.onmessage = e => {

      let signal = JSON.parse(e.data);

      if (signal.type === 'stop') {
        //remove video nodes
        while (this.videos.firstChild) {
          this.videos.removeChild(this.videos.firstChild);
        };
        //stop local media stream
        this.localStream.getTracks().forEach(track => {
          track.stop();
        })
        this.connected = false;
        this.collaborate = true;
        //delete descriptions
        delete this.pc.localDescription;
        delete this.pc.remoteDescription;
      };

      if (signal.type === 'toggleMute' && signal.id !== this.localStream.id) {
        var r = document.getElementById(signal.id);
        //toggle mute
        r.muted = !r.muted
        console.log(r, r.muted)
      };

      if (signal.type === 'join') {
        this.collaborate = false;
        this.connected = true;
      };

      if (signal.type === 'joinUp') {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true})
          .then (stream => {
            // set localStream equal to this stream
            this.localStream = stream
            this.gotStream(this.localStream)
          })
      };

      if (signal.type === 'connected') {
        //removes connect button
        this.connected = false;
        console.log('yeaa', this.connected)
      };

      if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.pc.localDescription) {
        //if signal is offer and we are the callee, set SDP offer as remote description
        this.pc.setRemoteDescription(signal.sdp)
        //attach our local stream to the peerConnection object
          .then(() => this.pc.addStream(this.localStream))
          //create answer
          .then(() => this.pc.createAnswer())
          //set this answer as our local description
          .then(answer => {this.ourAnswer = answer; this.pc.setLocalDescription(answer)})
          //send this answer along with our local stream data over WS signaling server
          .then(() => {
            this.wsrtc.send(JSON.stringify({ 'sdp': this.ourAnswer }));
          })
          .catch(e => { console.log('err at offer', e);})

      };

      if (signal.ice) {
        //add ice candidates to iceCandidates array in data
        this.iceCandidates.push(signal.ice)
      };

      if (signal.sdp && signal.sdp.type === 'answer' && signal.sdp !== this.pc.localDescription) {
        //on reception of answer as caller, set SDP answer as remote description
        this.pc.setRemoteDescription(signal.sdp)
          .then(() => {
            if (this.pc.remoteDescription && this.iceCandidates.length > 0)
            //if the local and remote description has been set and ice candidates exist
              for (var i = 0; i < this.iceCandidates.length; i++) {
                //add ice candidates to peerConnection
                this.pc.addIceCandidate(this.iceCandidates[i])
              }
          })
          .catch(e => { console.log('err at answer', e)})
      }
    }
  },

  record() {
    try {
      MediaRecorder = new MediaRecorder(this.localStream, {mimeType: "video/webm"});
    } catch (e) { console.log('Recording issues', e); return }

    this.theRecorder = MediaRecorder;
    MediaRecorder.ondataavailable = e => { this.recordedChuck.push(e.data);}
    MediaRecorder.start(100);
  },

  screen() {
    console.log('in screen')
    var receiver = null;
  },

  download() {
    this.theRecorder.stop();
    this.localStream.getTracks().forEach(track => { track.stop(); });

    var blob = new Blob(this.recordedChuck, {type: "video/mp4"});
    var url =  URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    //make rand number padd 4
    var rand =  ('0000' + Math.floor((Math.random() * 1000))).slice(-4);
    a.download = this.saverURI + rand +'.mp4';
    a.click();
    // setTimeout() here is needed for Firefox.
    setTimeout(function() { URL.revokeObjectURL(url); }, 100);
  }


}
