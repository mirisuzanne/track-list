class TrackList extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "track-list", TrackList);
    }
  }

  static icons = {
    play: '▶',
    pause: '⏸',
  };

  static #appendShadowTemplate = (node) => {
    const template = document.createElement("template");
    template.innerHTML = `
      <slot name="menu">
        <menu part="menu" track-part="menu">
          <li part="menu-item">
            <button part="button play" track-part="play">
              <btn-icon part="icon play-icon" aria-hidden="true">${TrackList.icons.play}</btn-icon>
              <btn-text part="text play-text">play</btn-text>
            </button>
          </li>
          <li part="menu-item">
            <button part="button prev" track-part="prev">
              <btn-icon part="icon prev-icon" aria-hidden="true">&Lang;</btn-icon>
              <btn-text part="text prev-text">previous</btn-text>
            </button>
            <button part="button next" track-part="next">
              <btn-text part="text next-text">next</btn-text>
              <btn-icon part="icon next-icon" aria-hidden="true">&Rang;</btn-icon>
            </button>
          </li>
        </menu>
      </slot>
      <slot name="tracks"></slot>
    `;
    const shadowRoot = node.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static #adoptShadowStyles = (node) => {
    const shadowStyle = new CSSStyleSheet();
    shadowStyle.replaceSync(`
      * { box-sizing: border-box; }
      [part=menu] {
        border-block: thin dotted;
        display: flex;
        justify-content: space-between;
        padding-block: 0.25em;
        gap: 0.4em;
      }
      [part=menu-item] {
        display: flex;
        gap: inherit;
      }
    `);
    node.shadowRoot.adoptedStyleSheets = [shadowStyle];
  }

  #trackList;
  tracks;
  menu;
  playBtn;
  #playIcon;
  #playText;
  prevBtn;
  nextBtn;

  constructor() {
    super();
    TrackList.#appendShadowTemplate(this);
    TrackList.#adoptShadowStyles(this);
  }

  get currentTrack () {
    return this.#trackList.querySelector('li[aria-current=true]')
      || [...this.tracks].at(0);
  }

  set currentTrack (toTrack) {
    const toTrackEl = typeof toTrack === 'number'
      ? [...this.tracks].at(toTrack)
      : toTrack;

    this.tracks.forEach((track) => {
      if (track === toTrackEl) {
        track.setAttribute('aria-current', 'true');
      } else {
        track.removeAttribute('aria-current');
        track.audio.pause();
      }
    });

    this.#updateMenu();
  }

  get playState() {
    return !this.currentTrack.audio.paused;
  }

  set playState(playNow) {
    const currentAudio = this.currentTrack.audio;

    if (playNow) {
      if (currentAudio.paused) currentAudio.play();
    } else {
      if (!currentAudio.paused) currentAudio.pause();
    }

    this.#updateMenu();
  }

  get prevTrack() {
    const track = this.currentTrack.previousElementSibling;
    if (track) track.audio = track.querySelector('audio');
    return track;
  }

  get nextTrack() {
    const track = this.currentTrack.nextElementSibling;
    if (track) track.audio = track.querySelector('audio');
    return track;
  }

  toPrev = () => {
    this.prevTrack.audio.currentTime = 0;

    if (this.playState) {
      this.playState = false;
      this.prevTrack.audio.play();
    } else {
      this.currentTrack = this.prevTrack;
    }
  }

  toNext = () => {
    this.nextTrack.audio.currentTime = 0;

    if (this.playState) {
      this.playState = false;
      this.nextTrack.audio.play();
    } else {
      this.currentTrack = this.nextTrack;
    }
  }

  playPause = () => {
    this.playState = !this.playState;
  }

  connectedCallback() {
    this.#menuSetup();
    this.#trackSetup();
    this.#menuListen();
  }

  disconnectedCallback() {
    this.#trackTearDown();
    this.#menuTearDown();
  }

  #menuSetup = () => {
    this.menu = this.querySelector(`[slot="menu"]`)
      || this.shadowRoot.querySelector(`[track-part="menu"]`);

    this.playBtn = this.menu.querySelector('button[track-part=play]');
    this.#playIcon = this.playBtn.querySelector('btn-icon');
    this.#playText = this.playBtn.querySelector('btn-text');

    this.prevBtn = this.menu.querySelector('button[track-part=prev]');
    this.nextBtn = this.menu.querySelector('button[track-part=next]');
  }

  #menuListen = () => {
    this.playBtn.addEventListener('click', this.playPause);
    this.prevBtn.addEventListener('click', this.toPrev);
    this.nextBtn.addEventListener('click', this.toNext);
  }

  #menuTearDown = () => {
    this.playBtn.removeEventListener('click', this.playPause);
    this.prevBtn.removeEventListener('click', this.toPrev);
    this.nextBtn.removeEventListener('click', this.toNext);
  }

  #togglePartName = (part, name, show) => {
    if (!part.hasAttribute('part')) return;

    const partNames = part.getAttribute('part')
      .split(' ')
      .filter((item) => item !== name);

    if (show) partNames.push(name);

    part.setAttribute('part', partNames.join(' '));
  }

  #updateMenu = () => {
    if (this.playState) {
      this.#playIcon.innerHTML = TrackList.icons.pause;
      this.#playText.innerText = "pause";
      this.#togglePartName(this.playBtn, 'paused', false);
    } else {
      this.#playIcon.innerHTML = TrackList.icons.play;
      this.#playText.innerText = "play";
      this.#togglePartName(this.playBtn, 'paused', true);
    }

    this.prevBtn.disabled = !this.prevTrack;
    this.nextBtn.disabled = !this.nextTrack;

    [this.prevBtn, this.nextBtn].forEach((btn) => {
      this.#togglePartName(btn, 'disabled', btn.disabled);
    });
  }

  #trackSetup = () => {
    this.#trackList = this.querySelector('[slot=tracks]');
    this.tracks = this.#trackList.querySelectorAll('li');

    this.tracks.forEach((track) => {
      track.audio = track.querySelector('audio');

      if (!track.audio) {
        console.error('Track is missing audio');
        return;
      }

      track.audio.addEventListener('play', this.#trackOnPlay);
      track.audio.addEventListener('pause', this.#trackOnPause);
      track.audio.addEventListener('ended', this.#trackOnEnded);
    });

    this.currentTrack = this.currentTrack;
  };

  #trackTearDown = () => {
    this.tracks.forEach((track) => {
      track.audio.removeEventListener('play', this.#trackOnPlay);
      track.audio.removeEventListener('pause', this.#trackOnPause);
      track.audio.removeEventListener('ended', this.#trackOnEnded);
    });
  };

  #trackOnPlay = (event) => {
    const track = event.currentTarget.closest('li');
    if (this.currentTrack !== track) this.currentTrack = track;
    if (!this.playState) {
      this.playState = true;
    } else {
      this.#updateMenu();
    }
  };

  #trackOnPause = (event) => {
    const track = event.currentTarget.closest('li');
    if (this.currentTrack === track && this.playState) {
      this.playState = false;
    } else {
      this.#updateMenu();
    }
  };

  #trackOnEnded = (event) => {
    const track = event.currentTarget;
    const upNext = this.nextTrack;

    if (upNext) {
      this.currentTrack = upNext;
      this.playState = true;
    } else {
      this.playState = false;
    }
  }
}

TrackList.register();
