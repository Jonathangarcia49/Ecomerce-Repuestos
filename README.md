# AutoParts - Fullstack PERN (Docker)

Aplicación ecommerce desarrollada con el stack PERN (PostgreSQL, Express, React, Node.js) utilizando Docker para la orquestación de servicios.

## Ejecutar el proyecto

```bash
docker compose up --build
```

## Servicios

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Documentación API (Swagger): http://localhost:4000/api/docs

## Usuarios

- Usuario administrador (seed)
- Email: admin@autoparts.com
- Password: Admin123\*

## Flujo básico de uso

1. Iniciar sesión como administrador en /login
2. Administrar productos en /admin/products (crear, editar, eliminar)
3. Registrar cliente en /register
4. Como cliente: agregar productos al carrito, realizar checkout y consultar órdenes
