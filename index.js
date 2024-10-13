import express from "express";
import path from "path";
import nunjucks from "nunjucks";

const __dirname = path.resolve();

//express 가져옴
const app = express();
//view engine Set
// .html 안붙여도 되는 세팅
app.set("view engine", "html"); //main.html -> main(.html)

// nunjucks
nunjucks.configure("views", {
  //views 라는 곳에 모아서 쓰겠다는 말
  watch: true, //html 파일이 수정될 경우, 다시 반영 후 렌더링
  express: app,
});

//middleware
//main page GET
app.get("/", (req, res) => {
  // res.send("Main Page GET Resquest~!");
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/write", (req, res) => {
  // render= 서버에서 렌더링한다. (랜더링할 파일 선택)
  res.render("write.html");
});
app.listen(3000, () => {
  console.log("Server is Running~!🎆");
}); //3000번 포트로 서버 구동
