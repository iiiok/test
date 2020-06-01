const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
var ObjectId = require("mongodb").ObjectID;

var multer = require("multer");
// var upload = multer({ dest: "uploads/" });
var uploadFolder = "./uploads/";

// ========================
// Link to Database
// ========================
// Updates environment variables
// @see https://zellwk.com/blog/environment-variables/
require("./dotenv");

// Replace process.env.DB_URL with your actual connection string
const connectionString = process.env.DB_URL;
console.log(connectionString);

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    const teamMemberCollection = db.collection("team_member");

    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));
    app.use('/uploads', express.static("uploads"));

    // ========================
    // Routes
    // ========================

    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .sort({ _id: -1 })
        .toArray()
        .then((quotes) => {
          console.log(quotes.length);
          db.collection("team_member").find().toArray().then(
            (team) =>{
              console.log("team.length", team);
              res.render("index.ejs", { quotes: quotes, teamList: team });
            }
          )
        })
        .catch(/* ... */);
    });

    app.get("/quote", (req, res) => {
      // console.log(req.query.id)
      db.collection("quotes")
        .find({ _id: new ObjectId(req.query.id) })
        .toArray()
        .then((quotes) => {
          // console.log(quotes[0])
          res.send(quotes[0]);
        })
        .catch((error) => console.error(error));
    });

    app.post("/quotes", (req, res) => {
      console.log(req.body._id);
      if (req.body._id.length > 5) {
        console.log("updating");
        quotesCollection
          .findOneAndUpdate(
            { _id: new ObjectId(req.body._id) },
            {
              $set: {
                name: req.body.name,
                subject: req.body.subject,
                BgColor: req.body.BgColor,
                quote: req.body.quote,
              },
            },
            {
              upsert: true,
            }
          )
          .then(res.redirect("/"))
          .catch((error) => console.error(error));
      } else {
        console.log("inserting");
        quotesCollection
          .insertOne(req.body)
          .then((result) => {
            res.redirect("/");
          })
          .catch((error) => console.error(error));
      }
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json("Success"))
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      console.log({ _id: req.body._id });
      quotesCollection
        .deleteOne({ _id: new ObjectId(req.body._id) })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vadar's quote");
        })
        .catch((error) => console.error(error));
    });

    // 通过 filename 属性定制
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
      },
      filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);
      },
    });

    // 通过 storage 选项来对 上传行为 进行定制化
    var upload = multer({ storage: storage });

    // 单图上传
    app.post("/upload", upload.single("avatar"), function (req, res, next) {
      var file = req.file;

      console.log("原始文件名：%s", file.originalname);
      console.log("文件大小：%s", file.size);
      console.log("Team Member 名称：%s", req.body.teamMember);
      console.log("文件保存路径：%s", file.path);
      // saveTeam2Db(req.body.teamMember, file.path);
      var myobj = { name: req.body.teamMember, imagePath: file.path };
      teamMemberCollection.insertOne(myobj, (err, res) => {
        if (err) throw err;
        console.log(req.body.teamMember, " was inserted.");
      });

      res.redirect("/");
    });

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === "production";
    const port = isProduction ? 7500 : 3030;
    app.listen(port, function () {
      console.log(`listening on ${port}`);
    });
  })
  .catch(console.error);
