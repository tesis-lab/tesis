/**
 * Listens for external messages coming from pages that match the url pattern defined in manifest.json
 */
chrome.runtime.onMessageExternal.addListener(
  function (request, sender, callback) {
    console.log('got request', request, sender);

    // to be used in iframe with different origin
    // sender.tab.url = sender.url;

    if (request.getVersion) {
      callback({ version: chrome.runtime.getManifest().version });
      return false; // Dispose of callback

    } else if (request.getStream) {
      // Gets chrome media stream token and returns it as the response
      chrome.desktopCapture.chooseDesktopMedia(
        ['desktop','screen','tab'], sender.tab,
        function (streamId) {
          callback({ streamId: streamId });
        });
      return true; // Preserve callback for future use

    } else {
      console.error('unknown request');
      callback({ error: 'Invalid request' });
      return false;
    }
  }
);

/**
 * Initiates the popup window
 */
chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });

});


let CapturedTabs = {};
function getCapturedTabs() {
  return CapturedTabs;
}

/**
 * Captures audio/video from the active tab and returns the media stream token as the response
 */
function startCapture(tab, audio, video) {
  CapturedTabs[tab.id] = {};
  var video_constraints = {
      mandatory: {
          chromeMediaSource: 'tab'
      }
  };
  // let constraints = { audio: audio, video: video };
  let constraints = {
    audio: audio,
    video: video,
    videoConstraints: {
      mandatory: {
        chromeMediaSource: 'tab',
        maxWidth: tab.width,
        maxHeight: tab.height
        // googMuteCapturedSource: false
      },
    },
  };

  chrome.tabCapture.capture(constraints, function (stream) {
    if (!stream) {
      console.error('capturing the tab has been failed.');
      return false;
    }
    tab.stream = stream;

    // prevent tab sound from muting
    window.audio = document.createElement('audio');
    window.audio.src = window.URL.createObjectURL(stream);
    window.audio.play();
    // TODO: must be removed after capturing is finished


    let recorder = new Recorder({ tabId: tab.id });
    recorder.onstart = captureStarted;
    recorder.onerror = captureFailed;
    if (recorder.start(stream)) {
      console.log('Start capture..', tab.id);
      // tab.stream = stream;
      recorder.onstop = captureStopped;
    } else {
      captureFailed();
    }
    tab.recorder = recorder;
    CapturedTabs[tab.id] = tab;
  });
}

function stopCapture(tabId) {
  console.log('stopCapture', tabId, CapturedTabs[tabId]);
  // CapturedTabs[tabId].stream.getTracks().forEach(track => {
  //   track.stop();
  // });
  if (typeof CapturedTabs[tabId] !== 'undefined') {
    let recorder = CapturedTabs[tabId].recorder;
    recorder.stop();
  }
}

function removeCapture(tabId) {
  delete CapturedTabs[tabId];
  console.log('removeCapture', tabId, CapturedTabs);
}

function captureStarted() {
  console.log('Capture started');
  // toggleBlinking(true);
}

function captureStopped() {
  console.log('Capture stopped');
  console.log(this);
  // toggleBlinking(false);
  this.mediaRecorder.stream.getTracks().forEach(track => {
    track.stop();
  });
  CapturedTabs[this.tabId].recorder = this;
  // download(tab, recorder.getCapturedMedia());
}

function captureFailed() {
  console.log('Capture failed');
}

function getCaptureInfo(tabId) {
  // console.log('getCaptureInfo', tabId);
  if (typeof CapturedTabs[tabId] !== 'undefined') {
    return CapturedTabs[tabId].recorder;
  }
  return null;
}

function downloadMedia(tabId) {
  let tab = CapturedTabs[tabId];
  console.log('download', tab);
  // return;
  // let blob = new Blob(recordedBlobs, { type: 'video/webm' });
  // let url = window.URL.createObjectURL(blob);
  let url = CapturedTabs[tabId].recorder.url;
  let a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = tab.title + '.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
  // chrome.tabs.create({ url: 'preview.html' }, function (tab) {});
}

// setup the popup
// chrome.browserAction.setBadgeText({ text: 'Rec..' });
// chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });

/**
 * Starts/Stops blinking browser action icon
 */
// let intervalId;
// function toggleBlinking(enabled) {
//   if (enabled) {
//     let n = 0;
//     intervalId = setInterval(function () {
//       if (n % 2 === 0) {
//         chrome.browserAction.setIcon({ path: 'skyroom-icon-16.png' });
//       } else {
//         chrome.browserAction.setIcon({ path: 'skyroom-icon-16-recording.png' });
//       }
//       n++;
//     }, 500);
//   } else {
//     clearInterval(intervalId);
//   }
// }
