/********************************************************************************
 * WEB322 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Reginald Bernardo Student ID: 109702233 Date: November 20, 2024
 *
 * Published URL: https://web322-assignment5-pied.vercel.app/lego/sets
 *
 ********************************************************************************/
const legoData = require("./modules/legoSets");
const authData = require("./modules/auth-service");
const express = require("express"); // "require" the Express module
const clientSessions = require("client-sessions");
const path = require("path");
const app = express(); // obtain the "app" object
app.use(express.static("public"));
require("pg"); // explicitly require the "pg" module
const Sequelize = require("sequelize");
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static(path.join(__dirname, "public"))); // for vercel

app.set("view engine", "ejs");

app.use(
  clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "o6LjQ5EVNC28ZgK64hDELM18ScpFQr", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

legoData
  .initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`app listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(`unable to start server: ${err}`);
  });

app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));

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

app.get("/login", (req, res) => {
  res.render("login", { errorMessage: "" });
});

app.get("/register", (req, res) => {
  res.render("register", { errorMessage: "", successMessage: "" });
});

app.post("/register", (req, res) => {
  authData
    .registerUser(req.body)
    .then(() => {
      res.render("register", {
        successMessage: "User created",
        errorMessage: "",
      });
    })
    .catch((err) => {
      res.render("register", {
        errorMessage: err,
        successMessage: "",
        userName: req.body.userName,
      });
    });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  authData
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("login", {
        errorMessage: err,
        userName: req.body.userName,
      });
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

app.get("/lego/addSet", ensureLogin, (req, res) => {
  legoData.getAllThemes().then((themeData) => {
    res.render("addSet", { themes: themeData });
  });
});

app.post("/lego/addSet", ensureLogin, (req, res) => {
  legoData
    .addSet(req.body)
    .then((data) => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.get("/lego/editSet/:num", ensureLogin, (req, res) => {
  return new Promise((resolve, reject) => {
    legoData
      .getSetByNum(req.params.num)
      .then((setData) => {
        legoData
          .getAllThemes()
          .then((themeData) => {
            resolve(themeData);
            res.render("editSet", { themes: themeData, set: setData });
          })
          .catch((err) => {
            res.status(404).render("404", { message: err });
          });
      })
      .catch((err) => {
        res.status(404).render("404", { message: err });
      });
  });
});

app.post("/lego/editSet", ensureLogin, (req, res) => {
  legoData
    .editSet(req.body.set_num, req.body)
    .then((data) => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.get("/lego/deleteSet/:num", ensureLogin, (req, res) => {
  legoData
    .deleteSet(req.params.num)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.use((req, res, next) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

// start the server on the port and output a confirmation to the console
//app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
