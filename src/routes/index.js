const newRouter = require("./news");
const courseRouter = require("./courses");
const siteRouter = require("./site");
const meRouter = require("./me");

function route(app) {
  app.use("/news", newRouter);
  app.use("/courses", courseRouter);

  app.use("/", siteRouter);
  app.use("/me", meRouter);
}

module.exports = route;
