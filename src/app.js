import "./scss/app.scss";

import imgur from "./services/imgur";
import * as utils from "./utils";

// Player for Youtube API Iframe
let player = null;

// Imgur Albums Hash with Lofi Pictures GIF
const albums = ["wUOIjM7"];

// All URL for GIF's
let gifs_url = [];

const init_gifs = async () => {
  for (const album_hash of albums) {
    gifs_url.push(...(await imgur.get_imgur_images_url(album_hash)));
  }
};

const render_gifs = () => {
  const root = utils.get_by_id("main");

  const img = utils.create_el("img");

  let last_gif = 0;

  const render_next_gif = () => {
    const is_last = last_gif === gifs_url.length - 1;

    const next_url = is_last ? gifs_url[0] : gifs_url[last_gif];

    last_gif = is_last ? 0 : last_gif + 1;

    img.src = next_url;

    setTimeout(() => {
      render_next_gif();
      // }, 120000);
    }, 5000);
  };
  render_next_gif();

  root.appendChild(img);
};
const render_components = () => {};

const init_player = () => {
  const on_player_ready = () => player.setPlaybackQuality("small");
  player = new YT.Player("player", {
    controls: "0",
    height: "360",
    width: "640",
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
  await init_gifs();
  await render_gifs();
  await render_components();
  await init_player();
};

window.onload = init;
