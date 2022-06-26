import express from "express";
import http from "http";
import ejs from "ejs";
import path from "path";
import { defaultUserSession, memberRouter } from "./routes/member.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const __dirname = path.resolve();

const app = express();

app.set("port", process.env.PORT || 8000);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret key 2022",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user || defaultUserSession;
  next();
});

app.use("/member", memberRouter);

app.get("/", (req, res) => {
  res.render("index");
});

http.createServer(app).listen(app.get("port"), () => {
  console.log(`Express server listening on port : ${app.get("port")}`);
});
