const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const sequelize = require("./config/connection");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3010;

const rebuild = process.argv[2] === "--rebuild";

app.use(
  cors({
    origin: "https://tech-blog-8ynl.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

app.use(routes);

sequelize
  .sync({ force: rebuild })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at https://tech-blog-8ynl.onrender.com`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database or start server:", err);
  });
