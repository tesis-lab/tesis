let $ = document.getElementById.bind(document);
let bg = chrome.extension.getBackgroundPage();
let AllTabs = [];
let CapturedTabs = [];
let CurrentTab;

document.addEventListener('DOMContentLoaded', function () {
});

// fetch the current active tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  console.log('CurrentTab', tabs);
  if (tabs.length) {
    CurrentTab = tabs[0];
    updateUi();
  }
});

/**
 * Gives list of tabs that are being captured
 */
function getCapturedTabs() {
  let cTabs = [];
  let tabs = bg.getCapturedTabs();
  for (let cTab in tabs) {
    if (tabs.hasOwnProperty(cTab)) {
      cTabs.push(tabs[cTab]);
    }
  }
  return cTabs;
}

function updateUi() {
  let $captures = $('captures');
  $captures.innerHTML = '';

  // add current tab
  let capInfo = bg.getCaptureInfo(CurrentTab.id);
  $captures.appendChild(getTabItem(CurrentTab, capInfo));

  // list captured tabs
  let tabs = getCapturedTabs();
  if (tabs.length) {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id === CurrentTab.id) continue;
      let capInfo = bg.getCaptureInfo(tabs[i].id);
      let $tab = getTabItem(tabs[i], capInfo);
      $captures.appendChild(document.createElement('hr'));
      $captures.appendChild($tab);
    }
  }
}

function getTabItem(tabInfo, capInfo) {
  let ce = document.createElement.bind(document);
  let $tab = ce('div');
  $tab.id = 'capture_' + tabInfo.id;
  $tab.className = 'box-grow row spaced-sm tab-capture';

  // tab icon
  // let $iconTab = ce('img');
  // if (tabInfo.favIconUrl && tabInfo.favIconUrl.indexOf('chrome://') === -1) {
  //   // Not allowed to load local resource
  //   $iconTab.src = tabInfo.favIconUrl;
  // }
  // $iconTab.className = 'box-shrink tab-icon';
  // $tab.appendChild($iconTab);

  // tab name
  // let $name = ce('span');
  // $name.innerHTML = tabInfo.title;
  // $name.className = 'box-grow tab-name';
  // $tab.appendChild($name);

  // add buttons container to DOM
  let $buttons = ce('span');
  $buttons.className = 'button-container';
  // add timer container to DOM
  let $timer = ce('span');
  $timer.className = 'timer-container';

    let $btnRec = ce('button');
    $btnRec.title = 'RECORD';
    $btnRec.className = 'record';
    $btnRec.innerHTML = '●';

    let $btnStop = ce('button');
    $btnStop.title = 'STOP';
    $btnStop.className = 'stop';
    $btnStop.innerHTML = '■';
    $buttons.appendChild($btnStop);

    $buttons.appendChild($btnRec);

    let $btnSave = ce('button');
    $btnSave.title = 'DOWNLOAD';
    $btnSave.className = 'download';
    $btnSave.innerHTML = '▼';
    $buttons.appendChild($btnSave);

    let $btnRemove = ce('button');
    $btnRemove.title = 'RESET';
    $btnRemove.className = 'reset';
    $btnRemove.innerHTML = 'x';
    $buttons.appendChild($btnRemove);
    // add timer
    $tab.appendChild($timer);

  if (!capInfo) { // capturing is not started yet

    $btnRec.addEventListener('click', startRecording);

  } else {


    if (capInfo.stopTime) { // capturing has finished

      $btnSave.addEventListener('click', downloadRecording.bind(null, tabInfo.id));

      $btnRemove.addEventListener('click', removeRecording.bind(null, tabInfo.id));


      $timer.innerHTML = formatSeconds(Math.round((capInfo.stopTime - capInfo.startTime) / 1000));


    } else { // still is capturing
      // let $iconRec = ce('button');
      // $iconRec.className = 'recordstill';
      // $iconRec.innerHTML = '●';
      // $tab.appendChild($iconRec);

      $timer.innerHTML = formatSeconds(Math.round((Date.now() - capInfo.startTime) / 1000));
      $tab.appendChild($timer);


      $btnStop.addEventListener('click', stopRecording.bind(null, tabInfo.id));

    }
  }
  $tab.appendChild($buttons);

  return $tab;
}

/**
 * Formats seconds to time(HH:MM:SS)
 */
function formatSeconds(n) {
  let hours = Math.floor(n / 60 / 60);
  let minutes = Math.floor((n - (hours * 60 * 60)) / 60);
  let seconds = Math.round(n - (hours * 60 * 60) - (minutes * 60));
  let time = ((minutes < 10) ? '0' + minutes : minutes)
    + ':' + ((seconds < 10) ? '0' + seconds : seconds);
  return hours ? hours + ':' + time : time;
}

setInterval(() => {
  updateUi();
}, 1100);

function startRecording() {
  // bg.startCapture(CurrentTab, CurrentTab.audible, true);
  bg.startCapture(CurrentTab, true, true);
}

function stopRecording(tabId) {
  bg.stopCapture(tabId);
}

function downloadRecording(tabId) {
  bg.downloadMedia(tabId);
}

function removeRecording(tabId) {
  bg.removeCapture(tabId);
  let $el = document.getElementById('capture_' + tabId);
  $el.parentElement.removeChild($el);
}

/*
Element.prototype.show = function () {
  console.log('show', this);
  this.style.display = 'block';
};
Element.prototype.hide = function () {
  this.style.display = 'none';
};
Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
};
*/
