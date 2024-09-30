/********************************************************************************
 * WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Reginald Bernardo Student ID: 109702233 Date: September 29, 2024
 *
 * Published URL: ___________________________________________________________
 *
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const myName = "Reginald Bernardo";
const studentNumber = 109702233;

legoData.initialize().then((data) => {
  console.log(data);
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.send(`Assignment 2: ${myName} - ${studentNumber}`);
});

app.get("/lego/sets", (req, res) => {
  legoData.getAllSets().then((data) => {
    res.send(data);
  });
});

app.get("/lego/sets/num-demo", (req, res) => {
  legoData
    .getSetByNum("0011-2")
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/lego/sets/theme-demo", (req, res) => {
  legoData
    .getSetsByTheme("town")
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});
