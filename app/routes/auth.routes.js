import express from "express";
// Importar middlewares de verificación de registro
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/index.js";
// Importar controladores de autenticación
import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router(); // Crear router de Express

// Middleware to set header, allowing CORS (though usually handled globally)
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


// Ruta para registrar un nuevo usuario (POST /api/auth/signup)
router.post(
  "/signup",
  [ // Middlewares a ejecutar antes del controlador signup
    checkDuplicateUsernameOrEmail, // Verifica si username o email ya existen
    checkRolesExisted // Verifica si los roles enviados son válidos
  ],
  signup // Controlador que maneja el registro
);

// Ruta para iniciar sesión (POST /api/auth/signin)
router.post("/signin", signin); // Va directo al controlador signin

export default router; // Exportar el router
