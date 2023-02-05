export default class BGM {
  constructor(id, src, volume, loop) {
    this.id = id;
    this.src = src;
    this.volume = volume;
    this.loop = loop;
    this.audioDOM = null;
    this.finish = false;
  }

  init() {
    if (this.finish) return false;

    const audioDOM = document.createElement("audio");

    audioDOM.src = this.src;
    audioDOM.hidden = true;
    audioDOM.volume = this.volume;
    audioDOM.id = this.id;
    audioDOM.loop = this.loop;

    this.audioDOM = audioDOM;
    document.body.appendChild(this.audioDOM);
  }

  startMusic() {
    this.audioDOM.play();
  }

  pauseMusic() {
    this.audioDOM.pause();
  }
}
