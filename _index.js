import { createServer } from "http";
//require 를 통해 http 라는 기본 모듈을 가져와서 사용할 수 있음!
// http 객체를 사용할 수 있게 됨!
// const { log } = require("console");
// const http = require("http");

//request, response 파라미터
// 서버 구축 코드
const server = createServer((req, res) => {
  //응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello node.js"); //응답 메시지
  res.end();
});
// node.js는 일반적으로 3000번 포트를 사용함
server.listen(3000, () => {
  console.log("서버 3000번 구동중입니다");
});
