const INIT_VOLUME: number = 0.5;

const PAUSED_ICON: string = "assets/icons/pause.svg";

const BUTTONS = [
  {
    id: 1,
    sound: "assets/sounds/summer.mp3",
    bg: "assets/bg/summer-bg.jpg",
    icon: "assets/icons/sun.svg",
  },
  {
    id: 2,
    sound: "assets/sounds/rain.mp3",
    bg: "assets/bg/rainy-bg.jpg",
    icon: "assets/icons/cloud-rain.svg",
  },
  {
    id: 3,
    sound: "assets/sounds/winter.mp3",
    bg: "assets/bg/winter-bg.jpg",
    icon: "assets/icons/cloud-snow.svg",
  },
];

class ActionButton {
  element!: HTMLButtonElement;
  id: number;
  sound: string;
  bg: string;
  icon: string;
  pausedIcon: string = PAUSED_ICON;

  constructor(id: number, sound: string, bg: string, icon: string) {
    const element = document.createElement("button");
    element.className = "action-button";
    element.style.backgroundImage = `url(${bg})`;
    element.innerHTML = `<img src=${icon} alt='no-icon' />`;

    this.element = element;
    this.id = id;
    this.sound = sound;
    this.bg = bg;
    this.icon = icon;
  }

  set handleClick(handler: Function) {
    this.element.addEventListener("click", () => handler(this.id));
  }

  setInitIcon() {
    this.element.innerHTML = `<img src=${this.icon} alt='no-icon' />`
  }

  setPausedIcon() {
    this.element.innerHTML = `<img src=${this.pausedIcon} alt='no-icon' />`;
  }
}

class Player {
  private player: HTMLAudioElement;
  private volumeEl: HTMLInputElement;
  isActive: boolean = false;
  buttonId!: number;

  constructor(volumeEl: HTMLInputElement) {
    this.player = new Audio();
    this.volumeEl = volumeEl;
    this.volumeEl.value = `${INIT_VOLUME}`;
    this.volumeEl.onchange = (e: Event) => this.handleVolume(e);
  }

  initPlayer(buttonId: number, sound: string): void {
    this.buttonId = buttonId;
    this.player.src = sound;
  }

  play(): void {
    this.isActive = true;
    this.player.play();
  }

  pause(): void {
    this.isActive = false;
    this.player.pause();
  }

  handleVolume(e: Event) {
    const value = +(e.target as HTMLInputElement).value;
    this.player.volume = value;
  }
}

class App {
  rootEl: HTMLDivElement;
  actionButtons!: ActionButton[];
  player!: Player;

  constructor() {
    const rootEl = document.getElementById("root") as HTMLDivElement;
    this.rootEl = rootEl;
  }
  
  init() {
    const actionsEl = document.getElementById("actions") as HTMLDivElement;
    const volumeEl = document.getElementById("volume") as HTMLInputElement;

    const player = new Player(volumeEl);
    this.player = player;

    const actionButtons: ActionButton[] = [];

    BUTTONS.forEach((btn) => {
      const { id, bg, icon, sound } = btn;
      const button = new ActionButton(id, sound, bg, icon);
      button.handleClick = (id: number) => this.handleClick(id);

      actionButtons.push(button);

      const el = button.element as HTMLButtonElement;
      actionsEl.appendChild(el);
    });

    this.actionButtons = actionButtons;
  }

  handleClick = (id: number): void => {
    const button = this.actionButtons.find((x) => x.id === id);

    if (button) {
      this.rootEl.style.backgroundImage = `url(${button.bg})`;

      if (button.id === this.player.buttonId) {
        if (this.player.isActive) {
          this.player.pause();
          button.setPausedIcon();
        } else {
          this.player.play();
          button.setInitIcon();
        }
      } else {
        if (this.player.buttonId) {
          const activeButton = this.actionButtons.find(x => x.id === this.player.buttonId);
          if (activeButton) activeButton.setInitIcon();
        }
        this.player.initPlayer(button.id, button.sound);
        this.player.play();
      }
    }
  };
};

window.addEventListener("load", (event): void => {
  const app = new App();
  app.init();
});
