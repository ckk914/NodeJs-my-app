import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path"; // 추가된 부분
import { error, log } from "console";
import mongoose from "mongoose";
//resolve() : 현재 작업 디렉토리의 절대 경로를 반환
const __dirname = path.resolve();

const app = express();

//file path
// join을 통해서 경로들을 합쳐줌 __dirname :실행 경로 + /data/writing.json
const filePath = path.join(__dirname, "data", "writing.json");
console.log("경로는?" + filePath);

// body parser set
//서버에서 쉽게 접근하고 처리할 수 있도록 함
app.use(bodyParser.urlencoded({ extended: false })); // express 기본 모듈 사용
app.use(bodyParser.json());

// view engine set
app.set("view engine", "html"); // main.html -> main(.html)

// nunjucks (템플릿 엔진을 설정) views 디렉토리
nunjucks.configure("views", {
  watch: true, // html 파일이 수정될 경우, 다시 반영 후 렌더링
  express: app,
});
//mongoose Connect (주소 작성)
mongoose.connect('mongodb://127.0.0.1:27017')
  .then(() => console.log('DB 연결 성공'))
  .catch(e => console.error(e));
  
//mongoose set
//스키마 기능을 사용
const { Schema } = mongoose;

const WriteSchema = new Schema({
  title: String,
  contents: String,
  date: {
    type: Date,
    default: Date.now,
  }
})
// 모델은 Writing이라는 이름으로 WriteSchema를 갖게 된다.
const Writing = mongoose.model('Writing', WriteSchema);

// middleware
// main page GET
app.get("/", async (req, res) => {
  //파일 가져옴
  const fileData = fs.readFileSync(filePath); //읽기
  const writings = JSON.parse(fileData); //변환
  res.render("main", { list: writings }); //메인에서 list 찍게 해둠
});

app.get("/write", (req, res) => {
  res.render("write");
});

app.post("/write", async (req, res) => {
  //request 안에 있는 내용들을 처리
  //request.body
  const title = req.body.title;
  const contents = req.body.contents;
  const date = req.body.date;

  // 데이터 저장
  // data/writing.json 안에 글 내용 저장
  // NodeJs는 비동기인데 안읽힌 채로 렌더링을 할 수 없으니까
  // readFileSync는 동기적으로 파일을 읽고⭐️
  // 파일을 모두 읽은 후에 다음 코드가 실행됩니다.
  const fileData = fs.readFileSync(filePath); //파일 읽기
  console.log(fileData);

  //JSON으로 파싱
  const writings = JSON.parse(fileData); // 파일 변환
  // console.log(writings);

  //request 데이터를 저장
  writings.push({
    title: title,
    contents: contents,
    date: date,
  });
  //data/writing.json에 저장하기
  //저장할때는 파일을 다시 버퍼 형태로 변환
  fs.writeFileSync(filePath, JSON.stringify(writings));

  //렌더링
  res.render("detail", {
    detail: { title: title, contents: contents, date: date },
  });
});

app.get("/detail", async (req, res) => {
  res.render("detail");
});

app.listen(3000, () => {
  console.log("Server is running🐶");
});
