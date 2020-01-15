import { Source } from '../types';
import { Decoder, DecoderFactory } from './decoder';

import { EventEmitter } from './event-emitter';

export class Player extends EventEmitter {
  decoderFactories: DecoderFactory<any>[];
  decoder?: Decoder;
  sources: Source[];
  _parentDom?: any;

  constructor (options: {
    decoders: DecoderFactory<any>[],
    sources: Source[]
  }) {
    super();
    this.decoderFactories = options.decoders.filter((decoder) => decoder.isSupported());
    // this.decoder = this.createDecoder();
    this.sources = options.sources;
    this.setSources(options.sources);
  }

  setSources (sources: Source[]) {
    this.sources = sources;
    if (this.decoder) {
      this.decoder.destroy();
    }
    this.decoder = this.createDecoder();
    if (this.decoder) {
      this.decoder.addAllListener((event) => {
        this.emit(event);
      })
    }
  }

  refresh () {
    if (this.sources) {
      this.setSources(this.sources);
      this.setup(this._parentDom);
    }
  }

  createDecoder () {
    for (let source of this.sources) {
      for (let decoder of this.decoderFactories) {
        if (decoder.isCanPlaySource(source)) {
          return decoder(source);
        }
      }
    }
  }

  get loading () {
    if (this.decoder) {
      return this.decoder.loading;
    }
    return false;
  }

  get buffered () {
    if (this.decoder) {
      return this.decoder.buffered;
    }
    return 0;
  }

  get currentTime () {
    if (this.decoder) {
      return this.decoder.currentTime;
    }
    return 0;
  }

  get duration () {
    return 0;
  }

  get state () {
    if (this.decoder) {
      return this.decoder.state;
    }

    return 'unready';
  }

  get volume () {
    if (this.decoder) {
      return this.decoder.volume;
    }
    return 0;
  }

  get muted () {
    if (this.decoder) {
      return this.decoder.muted;
    }

    return true;
  }

  setup (dom: HTMLElement) {
    this._parentDom = dom;
    if (this.decoder) {
      this.decoder.setup(dom);
    }
  }

  play () {
    if (this.decoder) {
      this.decoder.play();
    }
  }

  pause () {
    if (this.decoder) {
      this.decoder.pause();
    }
  }

  seek (targetTime: number) {
    if (this.decoder) {
      this.decoder.seek(targetTime);
    }
  }

  setMute (muted: boolean) {
    if (this.decoder) {
      this.decoder.setMute(muted);
    }
  }

  setVolume (volume: number) {
    if (this.decoder) {
      this.decoder.setVolume(volume);
    }
  }

  destroy () {
    super.destroy();
    if (this.decoder) {
      this.decoder.destroy();
    }
  }
}