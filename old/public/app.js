const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const peerName = urlParams.get('peerName');
if (!roomId || !peerName) {
  alert('You have to set roomId and peerName in url params. Like ?roomId=room1&peerName=Alice');
  throw new Error('roomId and peerName weren\'t set in url params');
}

const socket = io('/', { query: { roomId, peerName } });

// Create a local Room instance associated to the remote Room.
const room = new mediasoupClient.Room();
// Transport for sending our media.
let sendTransport;
// Transport for receiving media from remote Peers.
let recvTransport;

console.debug('ROOM:', room);

room.join(peerName)
  .then((peers) => {
    console.debug('PEERS:', peers);

    // Create the Transport for sending our media.
    sendTransport = room.createTransport('send');
    // Create the Transport for receiving media from remote Peers.
    recvTransport = room.createTransport('recv');

    peers.forEach(peer => handlePeer(peer));
  })
  .then(() => {
    // Get our mic and camera
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
  })
  .then((stream) => {
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    
      // Show local stream
      const localStream = new MediaStream([videoTrack, audioTrack]);
      const bloc = document.createElement('div');
      bloc.className = "videoBloc";
      const video = document.createElement('video');
      
     // video.setAttribute('autoplay', 'true');
      video.srcObject = stream;
      video.muted=true;
      video.autoplay = true;
      video.playsInline = true;

      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('playsInline', 'true');
      bloc.appendChild(video);
      const start = document.createElement('button');
      start.id = 'videoButton';
      /*start.value = "EDIT";
      start.innerHTML = "EDIT";
      //start.onclick = document.appendChild('video');*/
      const startText = document.createElement('p');
      startText.id = 'videoButton_Text';
      startText.textContent = "Camera";
      start.appendChild(startText);
      bloc.appendChild(start);
      document.getElementById('container').appendChild(bloc);
      video.play();
    

    // Create Producers for audio and video.
    const audioProducer = room.createProducer(audioTrack);
    const videoProducer = room.createProducer(videoTrack);

    // Send our audio.
    audioProducer.send(sendTransport);
    // Send our video.
    videoProducer.send(sendTransport);
  });

// Event fired by local room when a new remote Peer joins the Room
room.on('newpeer', (peer) => {
  console.debug('A new Peer joined the Room:', peer.name);

  // Handle the Peer.
  handlePeer(peer);
});

// Event fired by local room
room.on('request', (request, callback, errback) => {
  console.debug('REQUEST:', request);
  socket.emit('mediasoup-request', request, (err, response) => {
    if (!err) {
      // Success response, so pass the mediasoup response to the local Room.
      callback(response);
    } else {
      errback(err);
    }
  });
});

// Be ready to send mediaSoup client notifications to our remote mediaSoup Peer
room.on('notify', (notification) => {
  console.debug('New notification from local room:', notification);
  socket.emit('mediasoup-notification', notification);
});

// Handle notifications from server, as there might be important info, that affects stream
socket.on('mediasoup-notification', (notification) => {
  console.debug('New notification came from server:', notification);
  room.receiveNotification(notification);
});

/**
 * Handles specified peer in the room
 *
 * @param peer
 */
function handlePeer(peer) {
  // Handle all the Consumers in the Peer.
  peer.consumers.forEach(consumer => handleConsumer(consumer));

  // Event fired when the remote Room or Peer is closed.
  peer.on('close', () => {
    console.log('Remote Peer closed');
  });

  // Event fired when the remote Peer sends a new media to mediasoup server.
  peer.on('newconsumer', (consumer) => {
    console.log('Got a new remote Consumer');

    // Handle the Consumer.
    handleConsumer(consumer);
  });
}

/**
 * Handles specified consumer
 *
 * @param consumer
 */
function handleConsumer(consumer) {
  // Receive the media over our receiving Transport.
  consumer.receive(recvTransport)
    .then((track) => {
      console.debug('Receiving a new remote MediaStreamTrack:', consumer.kind);

      // Attach the track to a MediaStream and play it.
      const stream = new MediaStream();
      stream.addTrack(track);
        
      // Video Append
      if (consumer.kind === 'video') {
        const bloc = document.createElement('div');
        bloc.className = "videoBloc"
        const video = document.createElement('video');
        
        
        video.srcObject = stream;
        //video.muted=true;
        video.muted=true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('playsInline', 'true');


        bloc.appendChild(video);
        const start = document.createElement('button');
        start.id = 'videoButton';
        /*start.value = "EDIT";
        start.innerHTML = "EDIT";
        //start.onclick = document.appendChild('video');*/
        const startText = document.createElement('p');
        startText.id = 'videoButton_Text';
        startText.textContent = "Camera";
        start.appendChild(startText);
        bloc.appendChild(start);
        document.getElementById('container').appendChild(bloc);
        video.play();
      }
      
      // Audio append
      if (consumer.kind === 'audio') {
        const audio = document.createElement('audio');
        audio.srcObject = stream;
        document.getElementById('container').appendChild(audio);
        audio.play();
      }
    });

  // Event fired when the Consumer is closed.
  consumer.on('close', () => {
    console.log('Consumer closed');
  });
}
