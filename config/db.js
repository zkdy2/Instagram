const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const dbConf = require('./config');

let sequelize;
if (process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(
        dbConf.production.database,
        dbConf.production.username,
        dbConf.production.password,
        {
            host: dbConf.production.host,
            dialect: dbConf.production.dialect,
            port: dbConf.production.port,
            logging: false,
            dialectOptions: {
                ssl: {
                    ca: fs.readFileSync(path.resolve("config", "ca-certificate.crt")).toString()
                }
            }
        }
    );
} else {
    sequelize = new Sequelize(
        dbConf.development.database,
        dbConf.development.username,
        dbConf.development.password,
        {
            host: dbConf.development.host,
            dialect: dbConf.development.dialect,
            port: dbConf.development.port,
            logging: false
        }
    );
}

// Проверка подключения
sequelize
    .authenticate()
    .then(() => {
        console.log('✅ Connection prod to database has been established successfully.');
    })
    .catch((error) => {
        console.error('❌ Unable to connect to the database:', error);
    });

module.exports = sequelize;
