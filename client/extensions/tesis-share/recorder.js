class Recorder {
  constructor (options) {
    this.tabId = options.tabId;
    this.mediaRecorder = null;
    this.recordedBlobs = [];
    this.startTime = null;
    this.stopTime = null;
    this.onstart = null;
    this.onstop = null;
    this.onerror = null;
  }

  start(stream) {
    let options = { mimeType: 'video/webm' };
    let mr = this.mediaRecorder;
    try {
      mr = new MediaRecorder(stream, options);
    } catch (e) {
      console.error('err MediaRecorder: %s', e);
      return false;
    }
    console.log('Created MediaRecorder with options', options);
    mr.onstart = this._started.bind(this);
    mr.onstop = this._stopped.bind(this);
    mr.onerror = this._error.bind(this);
    mr.ondataavailable = this._dataAvailable.bind(this);
    mr.start();
    this.mediaRecorder = mr;
    return mr.state === 'recording';
  }

  stop() {
    console.log('Stop recorder..');
    this.mediaRecorder.stop();
  }

  getMediaUrl() {
    let blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
    return window.URL.createObjectURL(blob);
  }

  get state() {
    return this.mediaRecorder.state;
  }

  _getMimeType() {
    let mimeType = 'video/webm';
    // // let mimeType = 'audio/ogg; codecs=opus';
    // if (!MediaRecorder.isTypeSupported(mimeType)) {
    //   mimeType = 'video/webm; codecs=vp8';
    //   if (!MediaRecorder.isTypeSupported(mimeType)) {
    //     mimeType = 'video/webm';
    //     if (!MediaRecorder.isTypeSupported(mimeType)) {
    //       console.log('there is no supported mimetype');
    //       mimeType = '';
    //     }
    //   }
    // }
    return mimeType;
  }

  _dataAvailable(event) {
    // console.log(event.data.size);
    if (event.data && event.data.size > 0) {
      try {
        this.recordedBlobs.push(event.data);
      } catch (e) {
        console.error('Error occurred while storing media', e);
      }
    }
  }

  _started(event) {
    console.log('Recorder started');
    this.startTime = Date.now();
    this.recordedBlobs = [];
    if (this.onstart) {
      this.onstart();
    }
  }

  _stopped(event) {
    console.log('Recorder stopped');
    this.stopTime = Date.now();
    if (this.onstop) {
      this.url = this.getMediaUrl();
      this.onstop();
    }
  }

  _error(e) {
    console.error('An error occurred,', e);
    if (this.onerror) {
      this.onerror();
    }
  }
}
