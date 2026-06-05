# AI in Development - Backend + Frontend JWT Demo

Este proyecto incluye:

- `backend`: API FastAPI con autenticacion JWT.
- `frontend`: aplicacion React con pagina de login y pagina de bienvenida protegida.

El frontend consume el endpoint de login del backend, guarda el `access_token` en sesion (`sessionStorage`) y bloquea el acceso a la bienvenida cuando no existe una sesion activa.

## Estructura

```text
AI-in-development/
|-- DESIGN.md
|-- README.md
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   `-- security.py
|   |-- Dockerfile
|   |-- docker-compose.yml
|   `-- pyproject.toml
`-- frontend/
    |-- package.json
    |-- vite.config.js
    `-- src/
        |-- App.jsx
        |-- styles.css
        |-- pages/
        |   |-- LoginPage.jsx
        |   `-- WelcomePage.jsx
        |-- routes/
        |   `-- ProtectedRoute.jsx
        |-- services/
        |   `-- authApi.js
        `-- state/
            `-- AuthContext.jsx
```

## Requisitos

- Python 3.11+
- Poetry 1.8+
- Node.js 20+
- npm 10+

## Backend

Desde la carpeta `backend`:

```bash
poetry install
poetry run uvicorn app.main:app --reload
```

Backend disponible en `http://localhost:8000`.

### Endpoints principales

- `POST /auth/token`
- `POST /auth/refresh`
- `GET /health`

Credenciales de prueba:

- Usuario: `admin`
- Contrasena: `admin123`

## Frontend

Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`.

La configuracion de Vite usa proxy `/api` hacia `http://localhost:8000`.

## Flujo de uso

1. Levanta el backend.
2. Levanta el frontend.
3. Entra a `http://localhost:5173/login`.
4. Inicia sesion con `admin/admin123`.
5. Al autenticar, seras redirigido a `/welcome`.
6. Si no hay token en sesion, `/welcome` redirige automaticamente a `/login`.

## Estandar de diseno aplicado

El frontend implementa los lineamientos de `DESIGN.md`:

- Paleta principal: `#111827`, `#FFEDD5`, `#E0E7FF`, `#FFFFFF`.
- Tipografia `Inter`.
- Composicion full bleed con grid.
- Superficies tipo glass con blur/bordes suaves.
- Radios y espaciado basados en la escala definida.
- Animaciones de entrada expresivas y sobrias.

## Notas de autenticacion en frontend

- El token se guarda en `sessionStorage` bajo la clave `access_token`.
- El refresh token se guarda en `sessionStorage` bajo la clave `refresh_token`.
- El usuario se guarda en `sessionStorage` bajo la clave `username`.
- El frontend ejecuta refresh automatico del access token usando `POST /auth/refresh` antes del vencimiento.
- Al cerrar sesion, ambas claves se eliminan.
