const formatTime = (time) => {
  time = Math.round(time);

  const minutes = Math.floor(time / 60);

  const seconds = time - minutes * 60 < 10 ? "0" + seconds : seconds;

  return `${minutes}:${seconds}`;
};

const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);
const getByClass = document.getElementsByClassName.bind(document);
const getById = document.getElementById.bind(document);

export { formatTime, query, getByClass, queryAll, getById };
