import "./scss/app.scss";

import quotes from "./services/quotes";
import google from "./services/google";

import * as utils from "./utils";
import gifs_url from "./data";

// ========================================================================================
// YOUTUBE PLAYLIST THAT HAVE ALL SONGS
// ========================================================================================
const playlist_id = "PLuCUpg5b_vRqWMNwIH5oazz_qD170NtI4";

// ========================================================================================
// PLAYER VAR FOR YOUTUBE API IFRAME
// ========================================================================================
let player = null;

// ========================================================================================
// ADD STATIC CLASS TO LOADER TAG TO HIDE FROM UI
// ========================================================================================
const hide_loader = () => {
  const loader = utils.query(".loader");

  loader.classList.remove("loading");
  loader.classList.add("static");
};

// ========================================================================================
// RENDER GIF IN A IMG TAG AND ADD LOOP TO EVERY 5S CHANGE GIF
// ========================================================================================
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

// ========================================================================================
// INIT TIMER OBJECT AND ADD LISTENER TO EVERY SECOND TO UPDATE TIMER DISPLAY
// ========================================================================================
const render_timer = () => {
  // ========================================================================================
  // OBJECT TO MANAGER TIME, USED BY RENDER_TIMER() FUNCTION
  // ========================================================================================
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

  const timer_display = utils.get_by_id("timer");

  const on_update_timer = ({ current_time }) =>
    (timer_display.textContent = current_time);

  timer.init(on_update_timer);
};

// ========================================================================================
// GET A RANDOM QUOTE FROM OVER 1000 API QUOTES
// ========================================================================================
const render_quote = async () => {
  const quote_display = utils.get_by_id("quote");

  const all_quotes = await quotes.get_quotes();

  const current_quote =
    all_quotes[utils.random_number(0, gifs_url.length - 1)].text;

  quote_display.textContent = current_quote;
};

// ========================================================================================
// ADD FUNCIONALITY TO PLAYER : LEFT TO PLAY PREVIOUS SONG, AND RIGHT TO PLAY NEXT SONG
// ========================================================================================
const render_controls = () => {
  const control_left = utils.query(".buttons-wrapper.left");
  const control_right = utils.query(".buttons-wrapper.right");

  control_left.onclick = () => player.previousVideo();
  control_right.onclick = () => player.nextVideo();
};

// ========================================================================================
// WRAPPER FUNCTION TO RENDER ALL MAIN UI COMPONENTS
// ========================================================================================
const render_components = () => {
  render_timer();
  render_quote();
  render_controls();
};

// ========================================================================================
// FUNCTION TO INIT PLAYER FUNCTIONALITY USING YOUTUBE IFRAME API
// ========================================================================================
const init_player = async () => {
  const songs_count = await google.get_playlist_count(playlist_id);

  const on_player_ready = (e) => {
    e.target.loadPlaylist({
      list: playlist_id,
      listType: "playlist",
      index: utils.random_number(0, songs_count - 1),
      startSeconds: 0,
      suggestedQuality: "small",
    });

    hide_loader();
  };

  const on_player_state_change = (e) => {
    const current_song_button = utils.get_by_id("current-song");
    console.log(e.target.playerInfo.videoUrl);
    current_song_button.setAttribute("href", e.target.playerInfo.videoUrl);
  };

  player = new YT.Player("player", {
    height: "300",
    width: "300",
    playerVars: {
      controls: "0",
      autoplay: "1",
    },
    events: {
      onReady: on_player_ready,
      onStateChange: on_player_state_change,
    },
  });
};

// ========================================================================================
// LOADS COMPONENTS ASYNCHRONALLY WHEN WINDOW IS LOADED
// ========================================================================================
const init = async () => {
  await render_gifs();
  await render_components();
  await init_player();
};

window.onload = init;
