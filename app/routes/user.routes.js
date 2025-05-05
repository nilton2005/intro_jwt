import express from "express";
// Importar middlewares de autenticación y autorización
import { authJwt } from "../middlewares/index.js"; // Contiene verifyToken, isAdmin, etc.
// Importar controladores de acceso a contenido
import { allAccess, userBoard, adminBoard, moderatorBoard, updateUserRoles, deleteUser } from "../controllers/user.controller.js";

const router = express.Router(); // Crear router de Express

// Middleware to set header, allowing CORS (though usually handled globally)
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


// Ruta pública (GET /api/test/all)
router.get("/all", allAccess);

// Ruta solo para usuarios autenticados (GET /api/test/user)
router.get("/user", [authJwt.verifyToken], userBoard);

// Ruta solo para moderadores (GET /api/test/mod)
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], moderatorBoard);

// Ruta solo para administradores (GET /api/test/admin)
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

// Ruta para actualizar roles de un usuario (solo accesible por administradores)
router.put("/user-roles", [authJwt.verifyToken, authJwt.isAdmin], updateUserRoles);

// Ruta para eliminar un usuario (solo accesible por administradores)
router.delete("/user/:userId", [authJwt.verifyToken, authJwt.isAdmin], deleteUser);

export default router; // Exportar el router
