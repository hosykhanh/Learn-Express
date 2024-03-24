const path = require("path");
const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv").config();
const { default: mongoose } = require("mongoose");
const methodOverride = require("method-override");

const SortMiddleware = require('./app/middlewares/SortMiddleware');

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

//custom middleware
app.use(SortMiddleware);

// HTTP logger
// app.use(morgan("combined"));

//Template engine
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc',
        }
        const type = types[sort.type]

        return `<a href="?_sort&column=${field}&type=${type}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z"/>
                  </svg>
                </a> `
      }
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
