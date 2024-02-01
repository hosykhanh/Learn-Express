const path = require("path");
const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const app = express();
const port = 3001;

// HTTP logger
app.use(morgan("combined"));

//Template engine
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

console.log("PATH:", path.join(__dirname, "resources/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/news", (req, res) => {
  res.render("news");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
