import express from "express"; // Importa Express
import cors from "cors"; // Importa CORS
import db from "./app/models/index.js"; // Importa configuración de Sequelize y modelos
import authRoutes from "./app/routes/auth.routes.js"; // Importa rutas de autenticación
import userRoutes from "./app/routes/user.routes.js"; // Importa rutas de usuario

const app = express(); // Crea instancia de Express

// Configura CORS - permite solicitudes desde el frontend en port 3000
const corsOptions = {
  origin: "http://localhost:3001" // Frontend origin
};
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
// Middleware para parsear datos urlencoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Sincroniza la base de datos
const Role = db.role;
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
  initial(); // Call the function to create initial roles if they don't exist
}).catch(err => {
    console.log("Failed to sync db: " + err.message);
});

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication application." });
});

// Define las rutas base
app.use('/api/auth', authRoutes); // Rutas de autenticación bajo /api/auth
app.use('/api/test', userRoutes); // Rutas de prueba de acceso bajo /api/test

// Define el puerto del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// Función opcional para crear roles iniciales si la tabla está vacía
function initial() {
    Role.findAndCountAll().then(({ count }) => {
        if (count === 0) {
            Role.bulkCreate([
                { name: "user" },
                { name: "moderator" },
                { name: "admin" }
            ]).then(() => {
                console.log("Initial roles created.");
            }).catch(err => {
                console.error("Error creating initial roles:", err);
            });
        }
    }).catch(err => {
        console.error("Error checking roles count:", err);
    });
}
