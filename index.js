const express = require("express");
require("dotenv").config();
// const router = require("./src/routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello Developer!");
});

app.listen(port, () => {console.log(`Server is listening on port ${port}`);});