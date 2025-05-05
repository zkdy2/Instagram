const { Sequelize } = require("sequelize");
const dbConf = require("./config");

const isProd = process.env.NODE_ENV === "production";

const config = isProd ? dbConf.production : dbConf.development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    dialectOptions: config.dialectOptions,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`✅ Connected to ${isProd ? "production" : "development"} database`);
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });

module.exports = sequelize;
