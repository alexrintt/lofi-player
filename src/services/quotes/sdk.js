const get_quotes = async () => {
  const request = await fetch("https://type.fit/api/quotes");

  const quotes = await request.json();

  return quotes;
};

export { get_quotes };
