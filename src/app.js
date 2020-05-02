import "./scss/app.scss";

let player = null;

function initPlayer() {
  player = new YT.Player("player", {
    controls: "0",
    height: "360",
    width: "640",
    playerVars: {
      color: "white",
      controls: "0",
      listType: "playlis",
      list: "PLuCUpg5b_vRqWMNwIH5oazz_qD170NtI4",
    },
    events: {
      onReady: initControls,
    },
  });
}
function initControls() {
  player.playVideo();
}
window.onload = initPlayer;
