// app/config/db.config.js
export default {
  HOST: "localhost",
  USER: "root", // Replace with your MySQL username if different
  PASSWORD: "password", // Replace with your MySQL password
  DB: "db", // Ensure this database exists in your MySQL server
  PORT: 3306, // Puerto MySQL por defecto
  dialect: "mysql",
  pool: {
    max: 5, // Máximo de conexiones en el pool
    min: 0, // Mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo (ms) para obtener una conexión
    idle: 10000, // Tiempo máximo (ms) que una conexión puede estar inactiva
  },
};
