import express from "express";
import path from "path";

const __dirname = path.resolve();

//express 가져옴
const app = express();

//middleware
//main page GET
app.get("/", (req, res) => {
  // res.send("Main Page GET Resquest~!");
  res.sendFile(__dirname + "/public/main.html");
});
app.listen(3000, () => {
  console.log("Server is Running~!🎆");
}); //3000번 포트로 서버 구동
