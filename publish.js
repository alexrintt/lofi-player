const gh = require("gh-pages");

gh.publish("", (err) => {
  if (err) throw err;

  console.log("\x1b[36m%s\x1b[0m", "Sucess Publish! Congratulations!");
});
