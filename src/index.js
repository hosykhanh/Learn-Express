const path = require("path");
const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv").config();
const { default: mongoose } = require("mongoose");
const methodOverride = require("method-override");

const app = express();
const port = 3001;

const route = require("./routes");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(methodOverride("_method"));

// HTTP logger
// app.use(morgan("combined"));

//Template engine
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

//Routes init
route(app);

mongoose
  .connect(
    `mongodb+srv://hosykhanh1108:${process.env.MONGGO_DB}@mongotest.wsohlpi.mongodb.net/?retryWrites=true&w=majority&appName=mongotest`
  )
  .then(() => {
    console.log("connect success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
