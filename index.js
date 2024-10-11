import express from "express";

//express 가져옴
const app = express();

//middleware
//main page GET
app.get("/", (req, res) => {
  res.send("Main Page GET Resquest~!");
});
app.listen(3000, () => {
  console.log("Server is Running~!🎆");
}); //3000번 포트로 서버 구동
