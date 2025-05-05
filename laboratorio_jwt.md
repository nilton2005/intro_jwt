Markdown

# DESARROLLO DE APLICACIONES WEB AVANZADO
## LABORATORIO N°7: SEGURIDAD EN APLICACIONES CON JWT [cite: 1]

**Tecsup - TECNOLOGÍA CON SENTIDO** [cite: 1]

**DISEÑO Y DESARROLLO DE SOFTWARE**
**PROGRAMA DE FORMACIÓN REGULAR** [cite: 1]

---

## OBJETIVOS: [cite: 4]

Implementa aplicaciones usando un stack fullstack y JWT [cite: 4]

## SEGURIDAD: [cite: 4]

**Advertencia:** En este laboratorio está prohibida la manipulación del hardware, conexiones eléctricas o de red; así como la ingestión de alimentos o bebidas. [cite: 4, 5]

## FUNDAMENTO TEÓRICO: [cite: 5]

Revisar el texto guía que está en el campus Virtual. [cite: 5]

## NORMAS EMPLEADAS: [cite: 6]

No aplica [cite: 6]

## RECURSOS: [cite: 6]

En este laboratorio cada alumno trabajará con un equipo con Windows 11. [cite: 6]

## METODOLOGÍA PARA EL DESARROLLO DE LA TAREA: [cite: 6]

El desarrollo del laboratorio es individual [cite: 6]

## PROCEDIMIENTO: [cite: 6]

**Nota:** Las secciones en azul y cursiva brindan una explicación teórica o del código [cite: 6]

### 1. Procedimiento [cite: 6]

#### NODE.JS EXPRESS JWT AUTHENTICATION WITH MYSQL & ROLES [cite: 6]

Desarrollaremos una aplicación Node.js Express que permita a los usuarios: [cite: 6]

* Registrarse: Crear una nueva cuenta. [cite: 7]
* Iniciar sesión: autentíquese usando nombre de usuario y contraseña. [cite: 7]
* Acceso basado en roles: acceda a los recursos en función de roles (administrador, moderador, usuario). [cite: 7]

#### TECNOLOGIA [cite: 8]

* Node.js: entorno de ejecución. [cite: 8]
* Express 4: Marco web. [cite: 9]
* Sequelize 6: ORM para MySQL. [cite: 9]
* MySQL 8: Base de datos relacional. [cite: 10]
* JWT 9: Autenticación basada en token. [cite: 10]
* bcryptjs 2: Hashing de contraseñas. [cite: 10]
* CORS 2: Intercambio de recursos entre orígenes. [cite: 11]

---

**1.- Abrir el programa Visual Studio y crear la siguiente estructura de carpetas:** [cite: 11]

JWT03
├── app
│   ├── config
│   │   ├── auth.config.js
│   │   └── db.config.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares
│   │   ├── authJwt.js
│   │   ├── index.js
│   │   └── verifySignUp.js
│   ├── models
│   │   ├── index.js
│   │   ├── role.model.js
│   │   └── user.model.js
│   └── routes
│       ├── auth.routes.js
│       └── user.routes.js
├── node_modules
├── package-lock.json
├── package.json
└── server.js

[cite: 11]

**2.- Crear paquete JSON:** [cite: 11]
```bash
npm init -y
3.- Instalar dependencias:    

Bash

npm install express sequelize mysql2 cors jsonwebtoken bcryptjs
4.- Configurar package.json:    

JSON

"scripts": {
  "start": "node server.js"
}
   

5.- Actualización package.json de los módulos ES:    

JSON

{
  "type": "module"
}
   

CONFIGURACIÓN DE LA BASE DE DATOS    

7.- Crear archivo de configuración    

app/config/db.config.js: 
JavaScript

// app/config/db.config.js
export default {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "db",
  PORT: 3306, // Puerto MySQL por defecto
  dialect: "mysql",
  pool: {
    max: 5, // Máximo de conexiones en el pool
    min: 0, // Mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo (ms) para obtener una conexión
    idle: 10000, // Tiempo máximo (ms) que una conexión puede estar inactiva
  },
};
   
app/config/auth.config.js: 
JavaScript

//app/config/auth.config.js
export default {
  secret: "your-secret-key", // Clave secreta para firmar JWT
};
   
8.- Inicializar Sequelize y definir asociaciones de modelos:    

app/models/index.js: 
JavaScript

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

   
9.- Definir modelos.    

app/models/user.model.js: 
JavaScript

// /app/models/user.model.js
export default (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
   
app/models/role.model.js: 
JavaScript

// /app/models/role.model.js
export default (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });
  return Role;
};
   
IMPLEMENTACIÓN DE FUNCIONES DE MIDDLEWARE    

10.- Verificar el middleware de registro. 
Comprobamos si hay nombres de usuario o correos electrónicos duplicados y valida roles.    

app/middlewares/verifySignUp.js: 
JavaScript

import db from "../models/index.js";
const ROLES = db.ROLES;
const User = db.user;

// Middleware para verificar duplicados de username o email
export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Verificar username
    const userByUsername = await User.findOne({ where: { username: req.body.username } });
    if (userByUsername) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso!" }); [cite: 24]
    }

    // Verificar email
    const userByEmail = await User.findOne({ where: { email: req.body.email } }); [cite: 24]
    if (userByEmail) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso!" }); [cite: 25]
    }

    next(); // Continuar al siguiente middleware si no hay duplicados [cite: 22]
  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 22]
  }
};

// Middleware para verificar si los roles proporcionados existen
export const checkRolesExisted = (req, res, next) => { [cite: 23]
  if (req.body.roles) { // Verificamos si se proporcionaron roles [cite: 23]
    for (const role of req.body.roles) { // Iteramos sobre cada rol [cite: 23]
      if (!ROLES.includes(role)) { // Si el rol no existe en la lista permitida [cite: 23]
        return res.status(400).json({ message: `El rol ${role} no existe!` }); [cite: 23]
      }
    }
  }
  next(); // Continuar si todos los roles son válidos o no se proporcionaron roles [cite: 25]
};

  
11.- Middleware de autenticación JWT 
Verifica tokens y verifica los roles de los usuarios.    

app/middlewares/authJwt.js: 
JavaScript

import jwt from "jsonwebtoken"; // Para trabajar con JWT [cite: 26]
import authConfig from "../config/auth.config.js"; // Configuración (clave secreta) [cite: 26]
import db from "../models/index.js"; // Modelos y constantes [cite: 26]
const User = db.user; // Modelo User [cite: 26]

// Middleware para verificar la validez del token JWT
export const verifyToken = async (req, res, next) => { [cite: 27]
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Obtener token del header [cite: 28]

  if (!token) {
    return res.status(403).json({ message: "No se proporcionó un token!" }); [cite: 28]
  }

  // Si el token viene con 'Bearer ', quitarlo
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }


  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, authConfig.secret); [cite: 28]
    req.userId = decoded.id; // Almacenar ID del usuario en la solicitud [cite: 26]

    // Verificar si el usuario existe (opcional pero recomendado)
    const user = await User.findByPk(req.userId); [cite: 26]
    if (!user) {
         return res.status(401).json({ message: "No autorizado!" }); [cite: 26]
    }

    next(); // Token válido, continuar [cite: 27]
  } catch (err) {
    // Si hay error en la verificación (token inválido, expirado, etc.)
    return res.status(401).json({ message: "No autorizado!" }); [cite: 27]
  }
};

// Middleware para verificar si el usuario tiene rol de Admin
export const isAdmin = async (req, res, next) => { [cite: 28]
  try {
    const user = await User.findByPk(req.userId); [cite: 28]
    const roles = await user.getRoles(); [cite: 28]
    const adminRole = roles.find(role => role.name === "admin"); [cite: 29]

    if (adminRole) {
      next(); // Es admin, continuar [cite: 29]
      return;
    }

    res.status(403).json({ message: "Se requiere el rol de administrador!" }); [cite: 29]
  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 29]
  }
};

// Middleware para verificar si el usuario tiene rol de Moderator
export const isModerator = async (req, res, next) => { [cite: 32]
  try {
    const user = await User.findByPk(req.userId); [cite: 32]
    const roles = await user.getRoles(); [cite: 32]
    const modRole = roles.find(role => role.name === "moderator"); [cite: 33]

    if (modRole) {
      next(); // Es moderator, continuar [cite: 29]
      return;
    }

    res.status(403).json({ message: "Se requiere el rol de moderador!" }); [cite: 29]
  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 30]
  }
};

// Middleware para verificar si el usuario tiene rol de Moderator o Admin
export const isModeratorOrAdmin = async (req, res, next) => { [cite: 32]
  try {
    const user = await User.findByPk(req.userId); [cite: 32]
    const roles = await user.getRoles(); [cite: 32]
    // Verificar si alguno de los roles es 'admin' o 'moderator'
    const hasRole = roles.some(role => ["admin", "moderator"].includes(role.name)); [cite: 32, 33]

    if (hasRole) {
      next(); // Tiene rol requerido, continuar [cite: 34]
      return;
    }

    res.status(403).json({ message: "Se requiere el rol de moderador o administrador!" }); [cite: 34]
  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 34]
  }
};
  
12.- Exportación de middleware    

app/middlewares/index.js: 
JavaScript

// Importa todos los middlewares de authJwt.js
import * as authJwt from "./authJwt.js";
// Importa los middlewares de verifySignUp.js
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "./verifySignup.js";

// Reexporta los middlewares para fácil acceso
export { authJwt, checkDuplicateUsernameOrEmail, checkRolesExisted };
   
CREACIÓN DE CONTROLADORES    

13.- Controlador de autenticación. 
Maneja el registro e inicio de sesión del usuario.    

app/controllers/auth.controller.js: 
JavaScript

import db from "../models/index.js"; // Modelos (User, Role) [cite: 39]
import jwt from "jsonwebtoken"; // Para generar tokens JWT [cite: 39]
import bcrypt from "bcryptjs"; // Para encriptar contraseñas [cite: 39]
import authConfig from "../config/auth.config.js"; // Configuración (secreto JWT) [cite: 39]

const User = db.user; // Modelo User [cite: 40]
const Role = db.role; // Modelo Role [cite: 40]

// Controlador para el registro de usuarios (signup)
export const signup = async (req, res) => { [cite: 40]
  try {
    const { username, email, password, roles } = req.body; // Extraer datos [cite: 40]

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 8); // El segundo argumento es el salt rounds [cite: 41]

    // Crear nuevo usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }); [cite: 41]

    // Asignar roles
    if (roles) {
      // Buscar los roles en la BD por nombre
      const foundRoles = await Role.findAll({ where: { name: roles } });
      await user.setRoles(foundRoles); // Asocia los roles encontrados al usuario
    } else {
      // Si no se especifican roles, asignar rol 'user' por defecto
      const userRole = await Role.findOne({ where: { name: "user" } }); [cite: 41]
      if (userRole) {
          await user.setRoles([userRole]); [cite: 39]
      }
    }

    res.status(201).json({ message: "User registered successfully!" }); [cite: 39]

  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 39]
  }
};

// Controlador para el inicio de sesión (signin)
export const signin = async (req, res) => { [cite: 40]
  try {
    const { username, password } = req.body; [cite: 41]

    // Buscar usuario por username, incluyendo sus roles
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'roles' }] // Incluir roles asociados [cite: 41]
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." }); [cite: 41]
    }

    // Comparar contraseña proporcionada con la almacenada (hasheada)
    const passwordIsValid = await bcrypt.compare(password, user.password); [cite: 42]

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!"
      }); [cite: 43]
    }

    // Si la contraseña es válida, generar token JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24 horas [cite: 43]
    });

    // Crear array con los nombres de los roles en formato 'ROLE_ADMIN', 'ROLE_USER'
    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`); [cite: 43]

    // Responder con información del usuario y token
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    }); [cite: 43]

  } catch (error) {
    res.status(500).json({ message: error.message }); [cite: 44]
  }
};

  
14.- Controlador del usuario 
Maneja el acceso a recursos protegidos.    

app/controllers/user.controller.js: 
JavaScript

// Controlador para rutas públicas
export const allAccess = (req, res) => {
  res.status(200).send("Public Content."); // Contenido público [cite: 45]
};

// Controlador para rutas de usuarios autenticados
export const userBoard = (req, res) => {
  res.status(200).send("User Content."); // Contenido para usuarios comunes [cite: 45]
};

// Controlador para rutas de administradores
export const adminBoard = (req, res) => {
  res.status(200).send("Admin Content."); // Contenido para admins [cite: 45]
};

// Controlador para rutas de moderadores
export const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content."); // Contenido para moderadores [cite: 45]
};
  
DEFINICIÓN DE RUTAS    

15.- Rutas de autenticación y Rutas de usuario    

app/routes/auth.routes.js: 
JavaScript

import express from "express";
// Importar middlewares de verificación de registro
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/index.js";
// Importar controladores de autenticación
import { signup, signin } from "../controllers/auth.controller.js"; [cite: 47]

const router = express.Router(); // Crear router de Express [cite: 48]

// Ruta para registrar un nuevo usuario (POST /api/auth/signup)
router.post(
  "/signup",
  [ // Middlewares a ejecutar antes del controlador signup
    checkDuplicateUsernameOrEmail, // Verifica si username o email ya existen [cite: 48]
    checkRolesExisted // Verifica si los roles enviados son válidos [cite: 48]
  ],
  signup // Controlador que maneja el registro [cite: 50]
);

// Ruta para iniciar sesión (POST /api/auth/signin)
router.post("/signin", signin); // Va directo al controlador signin [cite: 52]

export default router; // Exportar el router [cite: 52]
  
app/routes/user.routes.js: 
JavaScript

import express from "express";
// Importar middlewares de autenticación y autorización
import { authJwt } from "../middlewares/index.js"; [cite: 49] // Contiene verifyToken, isAdmin, etc.
// Importar controladores de acceso a contenido
import { allAccess, userBoard, adminBoard, moderatorBoard } from "../controllers/user.controller.js"; [cite: 48]

const router = express.Router(); // Crear router de Express [cite: 50]

// Ruta pública (GET /api/test/all)
router.get("/all", allAccess); [cite: 50]

// Ruta solo para usuarios autenticados (GET /api/test/user)
router.get("/user", [authJwt.verifyToken], userBoard); [cite: 50, 51]

// Ruta solo para moderadores (GET /api/test/mod)
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], moderatorBoard); [cite: 51]

// Ruta solo para administradores (GET /api/test/admin)
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard); [cite: 52]

export default router; // Exportar el router [cite: 52]
  
16.- Crear server.js 
Usando la sintaxis ESModule, configure el servidor Express:    

server.js: 
JavaScript

import express from "express"; // Importa Express [cite: 52]
import cors from "cors"; // Importa CORS [cite: 52]
import db from "./app/models/index.js"; // Importa configuración de Sequelize y modelos [cite: 54]
import authRoutes from "./app/routes/auth.routes.js"; // Importa rutas de autenticación [cite: 54]
import userRoutes from "./app/routes/user.routes.js"; // Importa rutas de usuario [cite: 54]

const app = express(); // Crea instancia de Express [cite: 55]

// Configura CORS - permite solicitudes desde localhost:8000
const corsOptions = {
  origin: "http://localhost:8000" // Cambiar si tu frontend está en otro puerto/dominio
}; [cite: 55]
app.use(cors(corsOptions)); [cite: 55]

// Middleware para parsear JSON
app.use(express.json()); [cite: 56]
// Middleware para parsear datos urlencoded (formularios)
app.use(express.urlencoded({ extended: true })); [cite: 52]

// Sincroniza la base de datos
// force: false -> No borra las tablas si ya existen
// force: true -> Borra y recrea las tablas (¡CUIDADO EN PRODUCCIÓN!)
db.sequelize.sync({ force: false }).then(() => { [cite: 56]
  console.log("Database synchronized");
  // initial(); // Puedes llamar a una función para crear roles iniciales si es necesario
}).catch(err => {
    console.log("Failed to sync db: " + err.message);
});

// Ruta simple de prueba
app.get("/", (req, res) => { [cite: 53]
  res.json({ message: "Welcome to the Node.js JWT Authentication application." }); [cite: 53]
});

// Define las rutas base
app.use('/api/auth', authRoutes); // Rutas de autenticación bajo /api/auth [cite: 55]
app.use('/api/test', userRoutes); // Rutas de prueba de acceso bajo /api/test [cite: 55]

// Define el puerto del servidor
const PORT = process.env.PORT || 3000; [cite: 55]
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); [cite: 56]
});

/*
// Función opcional para crear roles iniciales si la tabla está vacía
function initial() {
    const Role = db.role;
    Role.findAndCountAll().then(({ count }) => {
        if (count === 0) {
            Role.create({ id: 1, name: "user" });
            Role.create({ id: 2, name: "moderator" });
            Role.create({ id: 3, name: "admin" });
            console.log("Initial roles created.");
        }
    });
}
*/
  
17.- Ejecutar la aplicación:    

Bash

npm start
18.- Insertar registro en la tabla roles. 
(Asegúrate de que tu base de datos 'db' exista y la conexión funcione)   

SQL

INSERT INTO roles(id, name, createdAt, updatedAt) VALUES (1, 'user', now(), now()); [cite: 59]
INSERT INTO roles(id, name, createdAt, updatedAt) VALUES (2, 'moderator', now(), now()); [cite: 59]
INSERT INTO roles(id, name, createdAt, updatedAt) VALUES (3, 'admin', now(), now()); [cite: 60]
(Nota: Si usaste la función initial() en server.js y force: true la primera vez, estos roles podrían crearse automáticamente)

PRUEBAS CON POSTMAN    

19.- Ejecute Postman    

20.- Registrar un usuario    

Método: POST
URL: http://localhost:3000/api/auth/signup (o el puerto que uses)
Body -> raw -> JSON:
JSON

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "roles": ["user"] // Opcional, si no se envía, será 'user' por defecto
}
21.- Iniciar sesión como usuario    

Método: POST
URL: http://localhost:3000/api/auth/signin
Body -> raw -> JSON:
JSON

{
    "username": "testuser",
    "password": "password123"
}
Copia el accessToken de la respuesta.
22.- Acceso a rutas protegidas. 
Utilice el accessToken recibido en el encabezado Authorization.    

En Postman, ve a la pestaña "Authorization" o "Headers".
Si usas "Authorization", selecciona "Bearer Token" y pega el token.
Si usas "Headers", añade una cabecera:
Key: Authorization
Value: Bearer TU_ACCESS_TOKEN_AQUI (O Key: x-access-token, Value: TU_ACCESS_TOKEN_AQUI si configuraste esa cabecera)
Puntos finales:    

GET /api/test/all - Público    
GET /api/test/user - Usuario, Moderador, Administrador    
GET /api/test/mod - Moderador    
GET /api/test/admin - Administrador    
