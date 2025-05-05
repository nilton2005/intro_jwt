// Importamos los modelos
import db from "../models/index.js";
const User = db.user;
const Role = db.role;

// Controlador para rutas públicas
export const allAccess = (req, res) => {
  res.status(200).send("Public Content."); // Contenido público
};

// Controlador para rutas de usuarios autenticados
export const userBoard = (req, res) => {
  res.status(200).send("User Content."); // Contenido para usuarios comunes
};

// Controlador para rutas de administradores
export const adminBoard = (req, res) => {
  res.status(200).send("Admin Content."); // Contenido para admins
};

// Controlador para rutas de moderadores
export const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content."); // Contenido para moderadores
};

// Controlador para actualizar roles de un usuario existente
export const updateUserRoles = async (req, res) => {
  try {
    const { userId, roles } = req.body;
    
    // Verificamos que el usuario exista
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Si se proporcionaron roles, los actualizamos
    if (roles && roles.length > 0) {
      // Buscamos los roles en la base de datos
      const foundRoles = await Role.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: roles
          }
        }
      });
      
      // Asignamos los nuevos roles (esto reemplaza todos los roles actuales)
      await user.setRoles(foundRoles);
      
      return res.status(200).json({ 
        message: "User roles updated successfully",
        roles: roles
      });
    } else {
      // Si no se proporcionaron roles, devolvemos un error
      return res.status(400).json({ message: "No roles specified" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controlador para eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificamos que el usuario exista
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Eliminamos el usuario
    await user.destroy();
    
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
