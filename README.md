# DevSecOps Pipeline Demo

Proyecto de plantilla simple para demostrar un flujo de CI/CD con prácticas de DevSecOps.

## Estructura del Proyecto

```
├── src/                    # Código fuente de la aplicación
│   ├── index.js           # Aplicación principal Express
│   └── utils.js           # Utilidades y funciones auxiliares
├── tests/                 # Pruebas unitarias
│   └── index.test.js      # Tests de la aplicación
├── docs/                  # Documentación del proyecto
│   ├── README.md          # Este archivo
│   ├── CHANGELOG.md       # Historial de cambios
│   ├── DEVSECOPS-SETUP.md # Guía de configuración DevSecOps
│   └── LICENSE            # Licencia del proyecto
├── k8s/                   # Manifiestos de Kubernetes
├── .github/workflows/     # Pipelines de GitHub Actions
├── .pre-commit-config.yaml   # Configuración de pre-commit hooks
├── release-please-config.json # Configuración de release-please
├── jest.config.js     # Configuración de Jest
├── sonar-project.properties  # Configuración de SonarQube
├── .zap/                  # Configuración de OWASP ZAP
├── Dockerfile             # Imagen Docker de la aplicación
└── package.json           # Dependencias y scripts de Node.js
```

## Comandos Principales

```bash
# Instalar dependencias
npm install

# Ejecutar la aplicación
npm start

# Ejecutar tests
npm test

# Construir imagen Docker
docker build -t devsecops-app .

# Ejecutar imagen Docker
docker run -p 3000:3000 devsecops-app
```

## Características

- **Aplicación Express**: API REST simple con endpoints de salud
- **Tests automatizados**: Configuración de Jest con cobertura
- **Pipeline DevSecOps**: Análisis de seguridad integrado (SAST, SCA, DAST)
- **Containerización**: Dockerfile optimizado para producción
- **Kubernetes**: Manifiestos listos para despliegue
- **Documentación**: Estructura organizada y mantenible

## Estructura Organizacional

Este proyecto sigue una estructura organizacional que separa claramente:

- **Código fuente** (`src/`): Solo el código de la aplicación
- **Documentación** (`docs/`): Toda la documentación del proyecto
- **Tests** (`tests/`): Pruebas unitarias y de integración
- **Infraestructura** (`k8s/`): Configuración de despliegue

Esta organización facilita el mantenimiento, la navegación del código y la separación de responsabilidades.
