const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];
let i = 0;

function initialize() {
  setData.forEach((dataObject) => {
    sets[i] = dataObject;
    const matching = themeData.find(
      (themeDataObject) => sets[i].theme_id === themeDataObject.id
    );
    if (matching) {
      sets[i].theme = matching.name;
    }
    i++;
  });

  return new Promise((resolve, reject) => {
    resolve('the "sets" array is filled with objects');
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    resolve(sets);
  });
}

function getSetByNum(setNum) {
  const matching = sets.find(
    (themeDataObject) => setNum === themeDataObject.set_num
  );
  return new Promise((resolve, reject) => {
    if (matching === undefined) {
      reject("unable to find requested set");
    }
    resolve(matching);
  });
}

function getSetsByTheme(theme) {
  const results = sets.filter((matchingThemeObject) => {
    return matchingThemeObject.theme.toLowerCase().includes(theme);
  });

  return new Promise((resolve, reject) => {
    if (results.length === 0) {
      reject("unable to find requested sets");
    }
    resolve(results);
  });
}

//initialize();
//console.log(getAllSets());
//console.log(getSetByNum("001-1"));
//console.log(getSetsByTheme("tech"));

// initialize().then((data) => {
//   console.log(data);
// });

// getAllSets().then((data) => {
//   console.log(data);
// });

// getSetByNum("001-1")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// getSetsByTheme("tech")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
