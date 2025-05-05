// Importamos Sequelize
import Sequelize from "sequelize";
// Importamos la configuración de la base de datos
import dbConfig from "../config/db.config.js";
// Importamos los modelos
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

// Creamos una instancia de Sequelize con la configuración
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  port: dbConfig.PORT,
});

// Creamos un objeto para almacenar los modelos y la instancia de Sequelize
const db = {};

db.Sequelize = Sequelize; // Clase Sequelize
db.sequelize = sequelize; // Instancia de Sequelize

// Inicializamos los modelos
db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

// Definimos la relación muchos a muchos entre roles y usuarios
db.role.belongsToMany(db.user, {
  through: "user_roles", // Tabla intermedia
  foreignKey: "roleId", // Clave foránea en tabla intermedia que referencia a roles
  otherKey: "userId", // Clave foránea en tabla intermedia que referencia a usuarios
});

// Definimos la relación inversa (muchos a muchos) entre usuarios y roles
db.user.belongsToMany(db.role, {
  through: "user_roles", // Tabla intermedia
  foreignKey: "userId", // Clave foránea que referencia a usuarios
  otherKey: "roleId", // Clave foránea que referencia a roles
  as: "roles", // Alias para acceder a los roles de un usuario
});

// Definimos una constante con los posibles roles
db.ROLES = ["user", "admin", "moderator"];

// Exportamos el objeto db
export default db;
