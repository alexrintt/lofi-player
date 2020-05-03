import "./scss/app.scss";

// import imgur from "./services/imgur";
import * as utils from "./utils";
import gifs_url from "./data";

// Player for Youtube API Iframe
let player = null;

const timer = {
  current_time: null,
  init(on_update_timer) {
    this.on_update_timer = on_update_timer;
    this.update_timer();
  },
  update_timer() {
    const date = new Date();

    const hours = utils.format_number(date.getHours());
    const sec = utils.format_number(date.getSeconds());
    const min = utils.format_number(date.getMinutes());

    this.current_time = utils.format_hour(hours, min, sec);
    this.on_update_timer(this);

    setTimeout(() => this.update_timer(), 1000);
  },
};

const render_gifs = () => {
  const root = utils.get_by_id("main");

  const img = utils.create_el("img");

  let current_gif = utils.random_number(0, gifs_url.length - 1);

  const render_next_gif = () => {
    const new_gif = utils.distinct_random_number(
      0,
      gifs_url.length - 1,
      current_gif
    );
    current_gif = new_gif;

    const next_gif_url = gifs_url[current_gif];

    img.src = next_gif_url;

    setTimeout(render_next_gif, 5000);
  };
  render_next_gif();

  root.appendChild(img);
};

const render_components = () => {
  const timer_display = utils.get_by_id("timer");

  const on_update_timer = ({ current_time }) =>
    (timer_display.textContent = current_time);

  timer.init(on_update_timer);
};

const init_player = () => {
  const on_player_ready = () => player.setPlaybackQuality("small");
  player = new YT.Player("player", {
    controls: "0",
    height: "300",
    width: "300",
    playerVars: {
      controls: "0",
      listType: "playlis",
      list: "PLuCUpg5b_vRqWMNwIH5oazz_qD170NtI4",
      autoplay: "1",
    },
    events: {
      onReady: on_player_ready,
    },
  });
};

const init = async () => {
  await render_gifs();
  await render_components();
  await init_player();
};

window.onload = init;
