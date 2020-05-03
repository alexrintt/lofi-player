const format_number = (num) => (num >= 10 ? num : `0${num}`);
const format_hour = (hour, min, sec) => `${hour}:${min}:${sec}`;
const random_number = (max, min) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const distinct_random_number = (max, min, current) => {
  let new_random_number = random_number(max, min);
  while (new_random_number === current) {
    return distinct_random_number(max, min, current);
  }
  return new_random_number;
};

const query = document.querySelector.bind(document);
const query_all = document.querySelectorAll.bind(document);
const get_by_class = document.getElementsByClassName.bind(document);
const get_by_id = document.getElementById.bind(document);
const create_el = document.createElement.bind(document);

export {
  format_number,
  format_hour,
  random_number,
  distinct_random_number,
  query,
  query_all,
  get_by_class,
  get_by_id,
  create_el,
};
