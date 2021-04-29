
if (location.href.substr(0, 5) !== 'https')
  location.href = 'https' + location.href.substr(4, location.href.length - 4)

const socket = io()


let producer = null;

//nameInput.value = 'bob' + Math.round(Math.random() * 1000)

socket.request = function request(type, data = {}) {
  return new Promise((resolve, reject) => {
    socket.emit(type, data, (data) => {
      if (data.error) {
        reject(data.error)
      } else {
        resolve(data)
      }
    })
  })
}

let rc = null

function joinRoom(name, room_id) {

  
  if (rc && rc.isOpen()) {
    console.log('already connected to a room')
  } else {

    rc = new RoomClient(localMedia, remoteVideos, remoteAudios, window.mediasoupClient, socket, room_id, name, roomOpen,ParticipantList)

    addListeners()
/*  var data = new FormData();
data.append('name', 'person');
data.append('RoomId', 5);


var xhr = new XMLHttpRequest();
xhr.open('POST', '/creatRoom', true);
xhr.onload = function () {
    // do something to response
    if(this.responseText){
      console.log("1")


        res.sendFile('Register.html', { root: __dirname });

      }
    }
};
xhr.send(data);*/

  
}

function roomOpen() {
  reveal(startAudioButton)
  hide(stopAudioButton)
  reveal(startVideoButton)
  hide(stopVideoButton)
  reveal(startScreenButton)
  hide(stopScreenButton)
  reveal(exitButton)
  control.className = ''
  reveal(videoMedia)
}

function hide(elem) {
  elem.className = 'hidden'
}

function reveal(elem) {
  elem.className = ''
}


function addListeners() {


  rc.on(RoomClient.EVENTS.stopAudio, () => {
    hide(stopAudioButton)
    reveal(startAudioButton)

  })
  rc.on(RoomClient.EVENTS.startAudio, () => {
    hide(startAudioButton)
    reveal(stopAudioButton)
  })

  rc.on(RoomClient.EVENTS.startVideo, () => {
    hide(startVideoButton)
    reveal(stopVideoButton)
  })
  rc.on(RoomClient.EVENTS.stopVideo, () => {
    hide(stopVideoButton)
    reveal(startVideoButton)
  })
  rc.on(RoomClient.EVENTS.exitRoom, () => {
    hide(control)
    hide(videoMedia)
  })
}

// Load mediaDevice options
navigator.mediaDevices.enumerateDevices().then(devices =>
  devices.forEach(device => {
    let el = null
    if ('audioinput' === device.kind) {
      el = audioSelect
    } else if ('videoinput' === device.kind) {
      el = videoSelect
    }
    if(!el) return

    let option = document.createElement('option')
    option.value = device.deviceId
    option.innerText = device.label
    el.appendChild(option)
  })
)}
