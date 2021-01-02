import "./scss/app.scss";

import quotes from "./services/quotes";
import google from "./services/google";

import * as utils from "./utils";
import gifs_url from "./data";

// ========================================================================================
// PLAYER VAR FOR YOUTUBE API IFRAME
// ========================================================================================
let player = null;
let songs_count;

// ========================================================================================
// ALL NECESSARY NODE ELEMENTS
// ========================================================================================

// For root
const root = utils.get_by_id("main");

// For loader
const loader = utils.query(".loader");

// For select change current playlist
const current_playlist = utils.get_by_id("playlist__id");

// For quote
const quote_display = utils.get_by_id("quote");

// For controls
const control_left = utils.query(".buttons-wrapper.left");
const control_right = utils.query(".buttons-wrapper.right");
const control_play = utils.query(".buttons-wrapper.play");
const control_play_icon = utils.query(".button-play");
const control_vol = utils.get_by_id("button-vol-input");

// For current song external link
const current_song_button = utils.get_by_id("current-song");

// For timer
const timer_display = utils.get_by_id("timer");

// For volume
const vol_level_key = "app__vol__level";
let vol_level = Number(localStorage.getItem(vol_level_key)) || 100;

// ========================================================================================
// WRAPPER FUNCTION TO GET PLAYER STATE, IF IS PLAYING OR NOT
// ========================================================================================
const yt_is_playing = () => player.getPlayerState() === 1;

// ========================================================================================
// ADD VOLUMEN CHANGE LISTENER TO SET YOUTUBE IFRAME API
// ========================================================================================
const on_vol_input = ({ target: { value } }) => {
  if (!player) return;

  vol_level = value;

  player.setVolume(vol_level);

  localStorage.setItem(vol_level_key, value);
};
control_vol.value = vol_level;
control_vol.oninput = on_vol_input;

// ========================================================================================
// MANAGE CLASS TO LOADER TAG TO HIDE OR SHOW FROM UI
// ========================================================================================
const render_loader_ui = () => {
  if (yt_is_playing()) {
    loader.classList.remove("loading");
    loader.classList.add("static");
    return;
  }

  loader.classList.remove("static");
  loader.classList.add("loading");
};

// ========================================================================================
// RENDER GIF IN A IMG TAG AND ADD LOOP TO EVERY 5S CHANGE GIF
// ========================================================================================
const render_gifs = () => {
  const img = utils.create_el("img");

  let current_gif = utils.random_number(0, gifs_url.length - 1);

  const render_next_gif = () => {
    const new_gif = utils.random_number(0, gifs_url.length - 1);

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

  const on_update_timer = ({ current_time }) =>
    (timer_display.textContent = current_time);

  timer.init(on_update_timer);
};

// ========================================================================================
// GET A RANDOM QUOTE FROM OVER 1000 API QUOTES
// ========================================================================================
const render_quote = async () => {
  const all_quotes = await quotes.get_quotes();

  const current_quote =
    all_quotes[utils.random_number(0, gifs_url.length - 1)].text;

  quote_display.textContent = current_quote;
};

// ========================================================================================
// ADD FUNCIONALITY TO PLAYER : LEFT TO PLAY PREVIOUS SONG, AND RIGHT TO PLAY NEXT SONG
// ========================================================================================
const render_player_ui = () => {
  const is_playing = yt_is_playing();

  control_play_icon.classList.add(is_playing ? "playing" : "paused");
  control_play_icon.classList.remove(is_playing ? "paused" : "playing");
};

const toggle_player_state = () => {
  if (!player) return;

  const is_playing = player.getPlayerState() === 1;

  is_playing ? player.pauseVideo() : player.playVideo();
};

const play_random_song = () => {
  if (!player || !songs_count) return;

  player.loadPlaylist({
    list: current_playlist.value,
    listType: "playlist",
    index: utils.random_number(0, songs_count - 1),
    startSeconds: 0,
    suggestedQuality: "small",
  });
};

const render_controls = () => {
  control_left.onclick = () => player && player.previousVideo();
  control_right.onclick = () => player && player.nextVideo();
  control_play.onclick = () => toggle_player_state();
  control_play.ondblclick = () => player && play_random_song();
  current_playlist.onchange = async () => await reinitialize_player();
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
  songs_count = await google.get_playlist_count(current_playlist.value);

  const on_player_ready = (e) => {
    e.target.loadPlaylist({
      list: current_playlist.value,
      listType: "playlist",
      index: utils.random_number(0, songs_count - 1),
      startSeconds: 0,
      suggestedQuality: "small",
    });
  };

  const on_player_state_change = (e) => {
    // To set the current song/video URL in external link "current song"
    current_song_button.setAttribute("href", e.target.playerInfo.videoUrl);

    render_loader_ui();
    render_player_ui();

    player.setVolume(vol_level);
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
// FUNCTION TO REINITIALIZE PLAYER WITH OTHER PLAYLIST
// ========================================================================================
const reinitialize_player = async () => {
  if (!player) return;

  player.destroy();

  return await init_player();
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
