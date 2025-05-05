import db from "../models/index.js"; // Modelos (User, Role)
import jwt from "jsonwebtoken"; // Para generar tokens JWT
import bcrypt from "bcryptjs"; // Para encriptar contraseñas
import authConfig from "../config/auth.config.js"; // Configuración (secreto JWT)

const User = db.user; // Modelo User
const Role = db.role; // Modelo Role
const Op = db.Sequelize.Op; // Sequelize operators

// Controlador para el registro de usuarios (signup)
export const signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body; // Extraer datos

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 8); // El segundo argumento es el salt rounds

    // Crear nuevo usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Asignar roles
    if (roles) {
      // Buscar los roles en la BD por nombre using Op.or
      const foundRoles = await Role.findAll({ where: { name: { [Op.or]: roles } } });
      await user.setRoles(foundRoles); // Asocia los roles encontrados al usuario
    } else {
      // Si no se especifican roles, asignar rol 'user' por defecto
      const userRole = await Role.findOne({ where: { name: "user" } });
      if (userRole) {
          await user.setRoles([userRole]);
      } else {
          // Handle case where default 'user' role doesn't exist yet
          console.error("Default 'user' role not found. Please ensure it exists in the database.");
          // Optionally create the role here if it's guaranteed to be missing only initially
          // const newUserRole = await Role.create({ name: "user" });
          // await user.setRoles([newUserRole]);
          // Or return an error
          // return res.status(500).json({ message: "Default user role not configured." });
      }
    }

    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para el inicio de sesión (signin)
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por username, incluyendo sus roles
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'roles' }] // Incluir roles asociados
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    // Comparar contraseña proporcionada con la almacenada (hasheada)
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // Si la contraseña es válida, generar token JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24 horas
    });

    // Crear array con los nombres de los roles en formato 'ROLE_ADMIN', 'ROLE_USER'
    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    // Responder con información del usuario y token
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
