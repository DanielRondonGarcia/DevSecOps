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

## Flujo de Commits y Releases con Release Please

Este proyecto utiliza `release-please` para automatizar la creación de releases y la generación del `CHANGELOG.md` basado en [Conventional Commits](https://www.conventionalcommits.org/).

El flujo general es el siguiente:

1.  **Desarrollo y Commits**: Cuando realizas cambios, asegúrate de que tus mensajes de commit sigan el estándar de Conventional Commits. Por ejemplo:
    *   `feat: agregar nueva funcionalidad X` (para nuevas características, resultará en un release `minor`)
    *   `fix: corregir error en Y` (para correcciones de errores, resultará en un release `patch`)
    *   `chore: actualizar dependencias` (no dispara un release por sí mismo, pero se incluirá en el changelog del próximo release)
    *   `docs: mejorar la documentación de Z`
    *   `perf!: mejorar el rendimiento de la API` (un `!` después del tipo indica un BREAKING CHANGE, resultará en un release `major`)

2.  **Push a `main`**: Cuando haces push de tus commits a la rama `main`, la acción `release-please` se activa automáticamente.

3.  **Acción `release-please`**:
    *   Analiza los commits desde el último release.
    *   Si detecta commits que justifican un nuevo release (como `feat`, `fix`, o un `BREAKING CHANGE`), crea o actualiza un Pull Request (PR) llamado "release-pr".
    *   Este PR contiene:
        *   La actualización de la versión en `package.json` (según SemVer).
        *   La actualización del archivo `CHANGELOG.md` con los cambios correspondientes.

4.  **Revisión y Merge del PR de Release**:
    *   Revisa el PR "release-pr" para asegurarte de que los cambios y la nueva versión son correctos.
    *   Una vez aprobado, haz merge de este PR a la rama `main`.

5.  **Creación del Release en GitHub**:
    *   Al hacer merge del PR "release-pr", `release-please` crea automáticamente un nuevo Release en GitHub.
    *   Este release incluirá las notas generadas en el `CHANGELOG.md` y un tag con la nueva versión (ej. `v1.2.3`).

### Diagrama de Flujo

```mermaid
graph TD
    A[Desarrollador hace commit convencional] --> B{Push a main?};
    B -- Sí --> C[GitHub Action: release-please se ejecuta];
    C --> D{Hay commits para release? (feat, fix, BREAKING CHANGE)};
    D -- Sí --> E[release-please crea/actualiza Release PR];
    E --> F[Release PR contiene: bump de versión en package.json y CHANGELOG.md actualizado];
    F --> G{Merge del Release PR?};
    D -- No --> H[No se crea PR de release. Cambios se acumulan para el próximo release];
    G -- Sí --> I[GitHub Action: release-please crea GitHub Release y Tag];
    G -- No --> J[Release PR espera a ser mergeado];
    I --> K[Nuevo release publicado!];
```

## Test
