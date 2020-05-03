import config from "./config";

const baseURL = "https://www.googleapis.com/youtube/v3/playlistItems";

const get_playlist = async (id) => {
  const url = new URLSearchParams();

  url.set("playlistId", id);
  url.set("key", config.API_KEY);
  url.set("part", "id");

  const request = await fetch(baseURL + "?" + url.toString());

  const response = await request.json();

  return response;
};

const get_playlist_count = async (id) => {
  const response = await get_playlist(id);

  const count = response.pageInfo.totalResults;

  return count;
};

export { get_playlist, get_playlist_count };
