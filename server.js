import express from "express";
import http from "http";
import ejs from "ejs";

const app = express();
app.set("port", process.env.PORT || 8000);

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

http.createServer(app).listen(app.get("port"), () => {
  console.log(`Express server listening on port : ${app.get("port")}`);
});
