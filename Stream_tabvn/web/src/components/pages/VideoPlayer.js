import React, { Component } from "react";
import PropTypes from "prop-types";


import Videojs from "video.js";
import 'video.js/dist/video-js.css';

// Add hls plug-in to guarantee to play m3u8 format video
import "videojs-contrib-hls";
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
// Import videojs style
import "video.js/dist/video-js.css";
// Custom style (see below)
import "./style.css";

// Add videojs to window, zh-CN.js language registration depends on videojs.addLanguage() method
// If the configuration does not take effect, set the <html lang="en"> </html> lang in public/index.html to "zh-CN"
window.videojs = Videojs;
import("video.js/dist/lang/zh-CN.js");

class VideoPlayer extends Component {
  static propTypes = {
    // video address
    src: PropTypes.string,
    // Video height
    height: PropTypes.string,
    // video width
    width: PropTypes.string
  };

  // default props
  static defaultProps = {
    src: "",
    width: 340,
    height: 360
  };

  state = {
    videoId: "custom-video" + +new Date()
  };

  // Initialize content
  UNSAFE_componentWillReceiveProps(props) {
    try {
      const { src } = props;
      if (!src || src === this.props.src) return;
      this.initVideo(src);
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    // Destroy the player
    if (this.player) {
      this.player.dispose();
    }
  }

  // initialize
  initVideo(src) {
    const { videoId } = this.state;
    const { height, width } = this.props;
    this.player = Videojs(videoId, {
      height,
      width,
      controls: true,
      preload: "auto",
      fluid: true
    });

    this.player.src({ src });
    this.player.hlsQualitySelector({
      displayCurrentQuality: true
    });
  }

  render() {
    const { videoId } = this.state;
    return (
      <div
        className="custom-video-warpper"
        style={{
          display: this.props.src ? "block" : "none"
        }}
      >
        {/* The className of the video tag must be "video-js", otherwise the style will not take effect */}
        <video id={videoId} className="video-js" />
      </div>
    );
  }
}

export default VideoPlayer;