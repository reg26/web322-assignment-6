/********************************************************************************
 * WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Reginald Bernardo Student ID: 109702233 Date: September 30, 2024
 *
 * Published URL: https://web322-assignment-2-gvd3trgvt-reg26s-projects.vercel.app/
 *
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express"); // "require" the Express module
const path = require("path");
const app = express(); // obtain the "app" object
app.use(express.static("public"));
const HTTP_PORT = process.env.PORT || 8080; // assign a port

legoData.initialize().then((data) => {
  console.log(data);
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/lego/sets", (req, res) => {
  if (typeof req.query.theme !== "undefined") {
    legoData
      .getSetsByTheme(req.query.theme)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
      });
  } else {
    legoData.getAllSets().then((data) => {
      res.send(data);
    });
  }
});

app.get("/lego/sets/:numDemo", (req, res) => {
  const numDemo = req.params.numDemo;
  legoData
    .getSetByNum(numDemo)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    });
});

// app.get("/lego/sets/theme-demo", (req, res) => {
//   legoData
//     .getSetsByTheme("towns")
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((error) => {
//       res.send(error);
//     });
// });
