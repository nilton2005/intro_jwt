import jwt from "jsonwebtoken"; // Para trabajar con JWT
import authConfig from "../config/auth.config.js"; // Configuración (clave secreta)
import db from "../models/index.js"; // Modelos y constantes
const User = db.user; // Modelo User

// Middleware para verificar la validez del token JWT
export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Obtener token del header

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  // Si el token viene con 'Bearer ', quitarlo
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }


  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id; // Almacenar ID del usuario en la solicitud

    // Verificar si el usuario existe (opcional pero recomendado)
    const user = await User.findByPk(req.userId);
    if (!user) {
         // Changed status to 404 as user not found is more appropriate than unauthorized
         return res.status(404).json({ message: "User not found!" });
    }

    next(); // Token válido, continuar
  } catch (err) {
    // Si hay error en la verificación (token inválido, expirado, etc.)
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

// Middleware para verificar si el usuario tiene rol de Admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const adminRole = roles.find(role => role.name === "admin");

    if (adminRole) {
      next(); // Es admin, continuar
      return;
    }

    res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar si el usuario tiene rol de Moderator
export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const modRole = roles.find(role => role.name === "moderator");

    if (modRole) {
      next(); // Es moderator, continuar
      return;
    }

    res.status(403).json({ message: "Require Moderator Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar si el usuario tiene rol de Moderator o Admin
export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    // Verificar si alguno de los roles es 'admin' o 'moderator'
    const hasRole = roles.some(role => ["admin", "moderator"].includes(role.name));

    if (hasRole) {
      next(); // Tiene rol requerido, continuar
      return;
    }

    res.status(403).json({ message: "Require Moderator or Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
