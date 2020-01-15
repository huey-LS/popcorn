import React, {
  createRef
} from 'react';

import { Player } from '@popcorn-video/video';

import { VideoPlayerContext } from './context';

export class VideoPlayer extends React.Component<{
  decoders: any[],
  sources: any[],
  autoplay?: boolean
}> {
  playerBox = createRef<HTMLDivElement>();
  _videoPlayer: Player;
  _destroyed = false;

  constructor (props: any) {
    super(props);
    const decoders = props.decoders;
    const sources = props.sources;
    this._videoPlayer = new Player({
      decoders,
      sources
    });
  }

  componentDidMount () {
    if (this.playerBox.current) {
      const autoUpdateEventTypes = [
        'play', 'pause', 'timeupdate', 'seeked',
        'loadeddata', 'canplay', 'volumechange',
        'error'
      ];
      this._videoPlayer.addAllListener((event: any) => {
        console.log(event.type);
        if (
          !this._destroyed &&
          ~autoUpdateEventTypes.indexOf(event.type)
        ) {
          this.forceUpdate();
        }
      })

      this._videoPlayer.setup(
        this.playerBox.current
      );
    }
  }

  componentWillUnmount () {
    this._destroyed = true;
    this._videoPlayer.destroy();
  }

  render () {
    const playContextContent = {
      state: this._videoPlayer.state,
      currentTime: this._videoPlayer.currentTime,
      duration: this._videoPlayer.duration,
      buffered: this._videoPlayer.buffered,
      volume: this._videoPlayer.volume,
      muted: this._videoPlayer.muted,
      loading: this._videoPlayer.loading,
      play: () => this._videoPlayer.play(),
      pause: () => this._videoPlayer.pause(),
      seek: (targetTime: number) => this._videoPlayer.seek(targetTime),
      setMute: (muted: boolean) => this._videoPlayer.setMute(muted),
      setVolume: (volume: number) => this._videoPlayer.setVolume(volume),
      refresh: () => this._videoPlayer.refresh()
    };

    return (
      <div style={{position: "relative", width: "100%", height: '100%', background: '#000'}}>
        <div
          style={{width: "100%", height: '100%'}}
          ref={this.playerBox}
        ></div>
        <VideoPlayerContext.Provider
          value={playContextContent}
        >
          {this.props.children}
        </VideoPlayerContext.Provider>
      </div>
    )
  }
}
