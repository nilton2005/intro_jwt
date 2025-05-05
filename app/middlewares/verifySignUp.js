import db from "../models/index.js";
const ROLES = db.ROLES;
const User = db.user;

// Middleware para verificar duplicados de username o email
export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Verificar username
    const userByUsername = await User.findOne({ where: { username: req.body.username } });
    if (userByUsername) {
      return res.status(400).json({ message: "Failed! Username is already in use!" });
    }

    // Verificar email
    const userByEmail = await User.findOne({ where: { email: req.body.email } });
    if (userByEmail) {
      return res.status(400).json({ message: "Failed! Email is already in use!" });
    }

    next(); // Continuar al siguiente middleware si no hay duplicados
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar si los roles proporcionados existen
export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) { // Verificamos si se proporcionaron roles
    for (const role of req.body.roles) { // Iteramos sobre cada rol
      if (!ROLES.includes(role)) { // Si el rol no existe en la lista permitida
        return res.status(400).json({ message: `Failed! Role ${role} does not exist!` });
      }
    }
  }
  next(); // Continuar si todos los roles son válidos o no se proporcionaron roles
};
