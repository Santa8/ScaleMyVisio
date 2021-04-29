module.exports = {
  server: {
    port: 8080
  },
  mediasoup: {
    // mediasoup Server settings.
    logLevel: 'warn',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rbe',
      'rtx'
    ],
    rtcIPv4: true,
    rtcIPv6: true,
    rtcAnnouncedIPv4: null,
    rtcAnnouncedIPv6: null,
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    // mediasoup Room codecs.
    mediaCodecs: [
      {
        kind: 'audio',
        name: 'opus',
        clockRate: 48000,
        channels: 2,
        parameters: {
          useinbandfec: 1
        }
      },
      {
        kind: 'video',
        name: 'VP8',
        clockRate: 90000,
        parameters:
          {
            'x-google-start-bitrate': 1000
          }
      }, 
     /* {
        kind: 'video',
        name: 'H264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1
        }
      }*/
    ],
    
    
    webRtcTransport: {
       listenIps: [
          {
            ip: '0.0.0.0',      
            announcedIp:'188.166.173.170' // replace by public IP address
          }
        ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      preferTcp: true,
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000,
    },
    // mediasoup per Peer max sending bitrate (in bps).
    maxBitrate: 500000
  }
};
