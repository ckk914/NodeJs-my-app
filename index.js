import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";

const app = express();

// body parser set
app.use(bodyParser.urlencoded({ extended: false })); // express 기본 모듈 사용
app.use(bodyParser.json());

// view engine set
app.set("view engine", "html"); // main.html -> main(.html)

// nunjucks
nunjucks.configure("views", {
  watch: true, // html 파일이 수정될 경우, 다시 반영 후 렌더링
  express: app,
});

// middleware
// main page GET
app.get("/", async (req, res) => {
  res.render("main");
});

app.get("/write", (req, res) => {
  res.render("write");
});

app.post("/write", async (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;
  const date = req.body.date;

  res.render("detail", {
    detail: { title: title, contents: contents, date: date },
  });
});

app.get("/detail", async (req, res) => {
  res.render("detail");
});

app.listen(3000, () => {
  console.log("Server is running");
});
