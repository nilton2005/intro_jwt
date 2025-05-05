// /app/models/role.model.js
export default (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Make id auto-incrementing
    },
    name: {
      type: Sequelize.STRING,
    },
  });
  return Role;
};
