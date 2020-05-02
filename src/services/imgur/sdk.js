import config from "./config";

const get_imgur_endpoint = (album_hash) => {
  return `https://api.imgur.com/3/album/${album_hash}/images`;
};

const get_imgur_images_url = async (album_hash) => {
  const request = await fetch(get_imgur_endpoint(album_hash), {
    headers: {
      Authorization: `Client-ID ${config.CLIENT_ID}`,
    },
  });

  const response = await request.json();

  const data = response.data.map((image) => image.link);

  console.log(data);
  return data;
};

export { get_imgur_images_url, get_imgur_endpoint };
