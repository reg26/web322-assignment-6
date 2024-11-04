/********************************************************************************
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Reginald Bernardo Student ID: 109702233 Date: November 4, 2024
 *
 * Published URL: https://web322-assignment-3-navy.vercel.app/
 *
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express"); // "require" the Express module
const path = require("path");
const app = express(); // obtain the "app" object
app.use(express.static("public"));
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static(path.join(__dirname, "public"))); // for vercel

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

legoData.initialize().then((data) => {
  console.log(data);
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/lego/sets", (req, res) => {
  if (typeof req.query.theme !== "undefined") {
    legoData
      .getSetsByTheme(req.query.theme)
      .then((data) => {
        res.render("sets", { sets: data }); // legoSets
      })
      .catch((error) => {
        res.status(404).render("404", {
          message: "I'm sorry, we're unable to find what you're looking for",
        });
      });
  } else {
    legoData.getAllSets().then((data) => {
      res.render("sets", { sets: data });
    });
  }
});

app.get("/lego/sets/:numDemo", (req, res) => {
  const numDemo = req.params.numDemo;
  legoData
    .getSetByNum(numDemo)
    .then((data) => {
      res.render("set", { set: data });
    })
    .catch(() => {
      res.status(404).render("404", {
        message: "I'm sorry, we're unable to find what you're looking for",
      });
    });
});
