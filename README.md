# Proyecto CI/CD Template

Este es un proyecto de plantilla simple para demostrar un flujo de CI/CD.

## Propósito

El propósito principal de este repositorio es servir como base para configurar pipelines de Integración Continua y Despliegue Continuo (CI/CD).

## Características

- Configuración mínima de Node.js.
- Listo para ser integrado con herramientas de CI/CD.
- Flujo de trabajo de GitHub Actions para releases automatizadas.

## Cómo empezar

1. Clona este repositorio.
2. Instala las dependencias: `npm install`
3. Configura los hooks de pre-commit: `npm run build` (esto ejecutará `pre-commit install`)
4. Ejecuta la aplicación (si aplica): `npm start`

## Flujo de Trabajo de CI/CD

Este proyecto utiliza GitHub Actions para la Integración Continua y el Despliegue Continuo. El flujo de trabajo está configurado para:

- Ejecutar pruebas (si existen) en cada push y pull request.
- Crear una release automáticamente cuando se hace un push a la rama `main` y se actualiza la versión en `package.json`.
- El versionado sigue el estándar de Versionado Semántico (SemVer).
