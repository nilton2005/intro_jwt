# JWT Authentication System con React y Node.js

Este proyecto implementa un sistema completo de autenticación basado en JWT (JSON Web Tokens) con un backend en Node.js/Express y un frontend en React, con un diseño temático "hacker" en verde y negro.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```
/lab07
├── app/              # Backend - Node.js/Express
└── frontend/         # Frontend - React
```

## Funcionalidades

- Autenticación completa (registro, inicio de sesión, cierre de sesión)
- Control de acceso basado en roles (usuario, moderador, administrador)
- Interfaces específicas para cada rol
- Navegación dinámica que cambia según el rol del usuario
- Validación de formularios
- Diseño temático "hacker" con estilo verde y oscuro
- Efecto de animación tipo "Matrix"

## Backend (Node.js/Express)

### Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- Sequelize (ORM)
- jsonwebtoken
- bcryptjs

### API Endpoints

#### Autenticación

- `POST /api/auth/signup` - Registrar un nuevo usuario
- `POST /api/auth/signin` - Iniciar sesión y obtener token JWT

#### Acceso a Recursos

- `GET /api/test/all` - Contenido público
- `GET /api/test/user` - Contenido para usuarios autenticados
- `GET /api/test/mod` - Contenido para moderadores
- `GET /api/test/admin` - Contenido para administradores

### Configuración

1. Configurar la base de datos en `app/config/db.config.js`
2. Configurar la clave secreta para JWT en `app/config/auth.config.js`

## Frontend (React)

### Tecnologías Utilizadas

- React
- React Router
- Axios
- CSS/Tailwind-like classes

### Componentes Principales

- **Navbar** - Barra de navegación que se adapta según el rol del usuario
- **Login/Register** - Formularios de autenticación con validación
- **Profile** - Muestra información del usuario autenticado
- **BoardUser/BoardModerator/BoardAdmin** - Paneles específicos para cada rol
- **MatrixRain** - Efecto visual de lluvia al estilo Matrix

## Instalación y Configuración

### Requisitos Previos

- Node.js (v14+)
- npm o yarn
- MySQL

### Configuración del Backend

1. Navegue a la carpeta raíz del proyecto
```bash
cd /path/to/lab07
```

2. Instale las dependencias
```bash
npm install
```

3. Configure la base de datos en `app/config/db.config.js`
```javascript
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "your_password",
  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
```

4. Inicie el servidor
```bash
node server.js
```

### Configuración del Frontend

1. Navegue a la carpeta del frontend
```bash
cd /path/to/lab07/frontend
```

2. Instale las dependencias
```bash
npm install
```

3. Inicie la aplicación React
```bash
npm start
```

## Uso de la Aplicación

### Registro e Inicio de Sesión

1. Acceda a http://localhost:3000/register para crear una cuenta
2. Acceda a http://localhost:3000/login para iniciar sesión

### Roles de Usuario

Por defecto, los usuarios nuevos tienen el rol básico `ROLE_USER`. Para asignar roles adicionales:

#### Método 1: Usando la API directamente

Para registrar un usuario con rol de administrador:

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "roles": ["admin"]
  }'
```

#### Método 2: Modificando la base de datos

Asigne roles a través de la tabla de relación `user_roles` en la base de datos.

## Flujo de Autenticación

1. El usuario se registra/inicia sesión a través del frontend
2. El backend valida las credenciales y genera un token JWT
3. El token se almacena en `localStorage` en el navegador
4. Para solicitudes protegidas, el frontend incluye el token en los headers
5. El backend verifica el token y autoriza/deniega según los roles

## Notas Importantes

- La barra de navegación cambia dinámicamente según el rol del usuario
- Las rutas están protegidas tanto en el frontend como en el backend
- Se utilizan middlewares para verificar tokens y roles en el backend
- El diseño temático "hacker" utiliza una paleta de colores verde y oscuro

## Solución de Problemas

- Si hay conflictos de puerto, el backend puede configurarse para usar un puerto diferente al 8080
- Para solucionar problemas de CORS, asegúrese de que el backend permita solicitudes desde el origen del frontend
- Si los cambios en la autenticación no se reflejan inmediatamente, puede ser necesario recargar la aplicación

## Arquitectura de Seguridad

Este proyecto implementa varias capas de seguridad:

1. **Autenticación**: Verifica la identidad del usuario
2. **Autorización**: Controla el acceso basado en roles
3. **Protección de rutas**: Evita el acceso no autorizado a componentes específicos
4. **Almacenamiento seguro**: Las contraseñas se hash con bcrypt
5. **Tokens JWT**: Proveen un mecanismo de autenticación sin estado

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abra un issue o PR para sugerencias o mejoras.
