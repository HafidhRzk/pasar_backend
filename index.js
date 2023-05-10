const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");

const router = require("./routes/index");
const swaggerDocument = require("./swagger.json");

const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT || 3006;

const app = express();

exports.appRoot = () => {
  let path = require("path").resolve(__dirname);
  return path;
};

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors());

app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));

app.use(express.static("public"));

app.use(
  "/api-docs",
  function (req, res, next) {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);
app.use("/", router);

app.all("*", (req, res, next) => {
  next({ statusCode: 404, message: "Endpoint not found" });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on ${port}`));
}

module.exports = app;
