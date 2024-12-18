import{ Sequelize} from 'sequelize';
import fs from 'fs';
let config = JSON.parse(fs.readFileSync("/Users/pritammondal/Documents/interview/config.json", "utf-8"));
const database = config.database;

const host = database?.host;
const port = database?.port;
const dialect = database?.dialect;
const databaseName = database?.database;
const username = database?.username;
const password = database?.password;

export const sequelize = new Sequelize(databaseName, username, password, {
    port: port,
    host: host,
    dialect: dialect,
    logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();;
    console.log('Connection has been established successfully.');

    // await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();
