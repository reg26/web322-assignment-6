require("dotenv").config();
const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: 5432,
    dialectModule: require("pg"),
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },

    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Set.belongsTo(Theme, { foreignKey: "theme_id" });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve('the "sets" array is filled with objects');
      })
      .catch(() => {
        reject("Error!!");
      });
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.findAll({ include: [Theme] }).then((data) => {
        resolve(data);
      });
    });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.findAll({
        include: [Theme],
        where: {
          set_num: setNum,
        },
      })
        .then((data) => {
          resolve(data[0]);
        })
        .catch((err) => {
          reject("Unable to find requested set");
        });
    });
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.findAll({
        include: [Theme],
        where: {
          "$Theme.name$": {
            [Sequelize.Op.iLike]: `%${theme}%`,
          },
        },
      })
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject("Unable to find requested sets");
        });
    });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.create({
        set_num: setData.set_num,
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        theme_id: setData.theme_id,
        img_url: setData.img_url,
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  });
}

function getAllThemes() {
  let themeArr = [];
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Theme.findAll().then((data) => {
        for (let i = 0; i < data.length; i++) {
          themeArr[i] = data[i];
        }
        resolve(themeArr);
      });
    });
  });
}

function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.update(
        {
          name: setData.name,
          year: setData.year,
          num_parts: setData.num_parts,
          theme_id: setData.theme_id,
          img_url: setData.img_url,
        },
        {
          where: { set_num: set_num },
        }
      )
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Set.destroy({ where: { set_num: set_num } })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet,
};
