# Backend JWT Demo

Aplicacion Web API construida con FastAPI para demostrar autenticacion JWT con un usuario fijo `admin` y password `admin123`.

## Caracteristicas

- Emision de `access_token` JWT con expiracion de 300 segundos.
- Emision de `refresh_token` JWT para solicitar un nuevo access token.
- Hashing de contrasenas con `passlib[bcrypt]`.
- Gestion de dependencias con Poetry usando `package-mode = false`.
- Archivos Docker para despliegue local.

## Estructura

```text
backend/
|-- app/
|   |-- __init__.py
|   |-- main.py
|   `-- security.py
|-- .dockerignore
|-- docker-compose.yml
|-- Dockerfile
|-- pyproject.toml
`-- README.md
```

## Requisitos

- Python 3.11+
- Poetry 1.8+
- Docker y Docker Compose opcionales

## Instalacion local

```bash
poetry install
poetry run uvicorn app.main:app --reload
```

Opcionalmente puedes definir `JWT_SECRET_KEY` para reemplazar la clave de ejemplo usada por defecto.

La API queda disponible en `http://localhost:8000`.

## Endpoints

### `POST /auth/token`

Solicita los parametros `username` y `password` y devuelve un `access_token` con expiracion de 300 segundos junto con un `refresh_token`.

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Respuesta:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### `POST /auth/refresh`

Recibe un `refresh_token` valido y devuelve un nuevo `access_token`.

```json
{
  "refresh_token": "<jwt>"
}
```

Respuesta:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### `GET /health`

Permite verificar que la API este en funcionamiento.

## Uso con Docker

Construccion y ejecucion:

```bash
docker compose up --build
```

Si quieres sobrescribir la clave JWT al arrancar el contenedor:

```bash
JWT_SECRET_KEY="una-clave-segura-de-al-menos-32-bytes" docker compose up --build
```

## Notas de seguridad

- La clave secreta JWT esta hardcodeada solo para este caso de uso; en un entorno real debe moverse a variables de entorno o un gestor de secretos.
- La dependencia `bcrypt` queda restringida a `>=3.2,<4.0` por compatibilidad con `passlib 1.7.x`.