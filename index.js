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
mongoose
  .connect("mongodb://127.0.0.1:27017")
  .then(() => console.log("DB 연결 성공"))
  .catch((e) => console.error(e));

//mongoose set
//스키마 기능을 사용
const { Schema } = mongoose;

const WriteSchema = new Schema({
  title: String,
  contents: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
// 모델은 Writing이라는 이름으로 WriteSchema를 갖게 된다.
const Writing = mongoose.model("Writing", WriteSchema);

//-------------------------------------
// GET
//-------------------------------------
// middleware
// main page GET
app.get("/", async (req, res) => {
  //파일 가져옴
  // const fileData = fs.readFileSync(filePath); //읽기
  // const writings = JSON.parse(fileData); //변환

  // find안에 {}빈 것을 넣으면 Writing으로 이루어진 모든 것들을 읽어온다
  let writings = await Writing.find({});

  res.render("main", { list: writings }); //메인에서 list 찍게 해둠
});

app.get("/write", (req, res) => {
  res.render("write");
});


//-------------------------------------
// write
//-------------------------------------
//async 요청은 await이 끝났을때야 마무리 된다~!
app.post("/write", async (req, res) => {
  //request 안에 있는 내용들을 처리
  //request.body
  const title = req.body.title;
  const contents = req.body.contents;
  // const date = req.body.date;

  // 데이터 저장 (MongoDB)
  // 새로운 객체 생성하여 저장
  const writing = new Writing({
    title: title,
    contents: contents,
  });

  try {
    await writing.save();
    console.log("Success");

    //렌더링
    res.render("detail", {
      detail: { title: title, contents: contents },
    });
  } catch (err) {
    console.error(err);
    // res.status(500).send("Internal Server Error");
    res.render("write");
  }
});

//-------------------------------------
// 상세 페이지
//-------------------------------------
//디비에서 데이터를 가져오기 위해 async 를 붙임
app.get("/detail/:id", async (req, res) => {
  //id값 = req.params.id
  const id = req.params.id;
  try {
    //db에서 가져오기
    const detail = await Writing.findOne({ _id: id });
    res.render('detail', { 'detail': detail });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
})

//-------------------------------------
// edit => get
//-------------------------------------
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  const edit = await Writing.findOne({ _id: id })
    .then((result) => {
      res.render("detail", { edit: result });
    })
    .catch((err) => {
      console.error(err);
    });
});

//-------------------------------------
// edit => post
//-------------------------------------
app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const contents = req.body.contents;

  const edit = await Writing.replaceOne(
    { _id: id },
    { title: title, contents: contents }
  )
    .then((result) => {
      console.log("update success");
      res.render("detail", {
        detail: { id: id, title: title, contents: contents },
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

//-------------------------------------
// delete => post
//-------------------------------------
app.post('/delete/:id', async (req, res) => {
  const id = req.params.id; //id 가져옴


  const delete_content = await Writing.deleteOne({ _id: id }).then(() => {
    console.log('delete success');
    res.redirect('/');  //성공 시 메인으로 이동 시키자~!
    
  }).catch((err) => {
    console.error(err);
    
  })
})

//-----------------------------------
app.listen(3000, () => {
  console.log("Server is running🐶");
});
