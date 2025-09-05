# DevSecOps Pipeline Setup Guide

## 🔒 Descripción General

Este proyecto implementa un pipeline completo de DevSecOps con múltiples herramientas de análisis de seguridad:

- **SAST (Static Application Security Testing)**: SonarQube
- **DAST (Dynamic Application Security Testing)**: OWASP ZAP
- **SCA (Software Composition Analysis)**: Trivy
- **IaC Security (Infrastructure as Code Security)**: Checkov

## 🚀 Orden de Ejecución del Pipeline

### 1. Build and Test
- Instalación de dependencias
- Ejecución de tests
- Build de la aplicación

### 2. Análisis de Seguridad Estático (Paralelo)
- **SAST con SonarQube**: Análisis del código fuente
- **SCA con Trivy**: Análisis de dependencias y vulnerabilidades
- **IaC Security con Checkov**: Análisis de Dockerfile y GitHub Actions

### 3. Build y Push de Docker Image
- Construcción de la imagen Docker
- Escaneo de la imagen con Trivy
- Push al registry (GitHub Container Registry)

### 4. Deploy para Testing
- Despliegue temporal de la aplicación
- Verificación de health checks

### 5. Análisis de Seguridad Dinámico
- **DAST con OWASP ZAP**: Análisis de la aplicación en ejecución

### 6. Resumen de Seguridad
- Generación de reporte consolidado
- Upload de resultados a GitHub Security tab

### 7. Deploy a Producción (Condicional)
- Solo si todos los checks de seguridad pasan
- Solo en la rama `main`

## ⚙️ Configuración Requerida

### Secrets de GitHub

Configura los siguientes secrets en tu repositorio:

```bash
# SonarQube Configuration
SONAR_TOKEN=your_sonar_token_here
SONAR_HOST_URL=https://your-sonarqube-instance.com

# Opcional: Para notificaciones
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### Variables de Entorno

```yaml
env:
  REGISTRY: ghcr.io  # GitHub Container Registry
  IMAGE_NAME: ${{ github.repository }}
```

## 🛠️ Herramientas Implementadas

### 1. SonarQube (SAST)
- **Propósito**: Análisis estático del código fuente
- **Detecta**: Code smells, bugs, vulnerabilidades de seguridad
- **Configuración**: `sonar-project.properties`
- **Reportes**: Quality Gate, Security Hotspots

### 2. Trivy (SCA)
- **Propósito**: Análisis de dependencias y contenedores
- **Detecta**: Vulnerabilidades en dependencias, imágenes Docker
- **Formatos**: SARIF (para GitHub Security), Table (para logs)
- **Cobertura**: package.json, Dockerfile, imagen final

### 3. Checkov (IaC Security)
- **Propósito**: Análisis de infraestructura como código
- **Detecta**: Misconfigurations en Dockerfile, GitHub Actions
- **Frameworks**: dockerfile, github_actions
- **Reportes**: SARIF format

### 4. OWASP ZAP (DAST)
- **Propósito**: Análisis dinámico de aplicación en ejecución
- **Detecta**: Vulnerabilidades web (XSS, SQL Injection, etc.)
- **Configuración**: `.zap/rules.tsv`
- **Tipos de scan**: Baseline y Full scan

## 📊 Reportes y Resultados

### GitHub Security Tab
Todos los resultados se suben automáticamente a la pestaña Security:
- Trivy: Vulnerabilidades de dependencias e imagen
- Checkov: Issues de infraestructura
- SonarQube: Vulnerabilidades de código

### Artifacts
- Reportes de ZAP (HTML, JSON, Markdown)
- Logs detallados de cada herramienta

### Summary Report
Cada ejecución genera un resumen en el GitHub Actions Summary con:
- Estado de cada check de seguridad
- Enlaces a reportes detallados
- Recomendaciones de remediación

## 🔧 Personalización

### Ajustar Reglas de ZAP
Edita `.zap/rules.tsv` para:
- Ignorar falsos positivos
- Añadir reglas específicas
- Configurar umbrales de severidad

### Configurar SonarQube
Modifica `sonar-project.properties` para:
- Ajustar exclusiones
- Configurar quality gates
- Personalizar métricas

### Modificar Pipeline
El workflow está modularizado en jobs independientes:
- Puedes deshabilitar jobs específicos
- Ajustar condiciones de ejecución
- Modificar triggers

## 🚨 Manejo de Fallos

### Estrategia de Continue-on-Error
- Los análisis de seguridad usan `continue-on-error: true`
- Permite que el pipeline continúe aunque haya vulnerabilidades
- Los resultados se reportan pero no bloquean el deploy

### Quality Gates
- SonarQube: Configurable via quality gate
- Trivy: Severidad configurable
- Checkov: Soft fail habilitado
- ZAP: Continue on error para evitar bloqueos

## 📝 Mejores Prácticas

### Seguridad
1. **Secrets Management**: Usa GitHub Secrets para tokens
2. **Least Privilege**: El pipeline usa permisos mínimos
3. **Image Security**: Usuario no-root en Dockerfile
4. **Dependency Scanning**: Análisis en múltiples etapas

### Performance
1. **Parallel Execution**: Análisis de seguridad en paralelo
2. **Docker Cache**: Optimización de build con cache
3. **Conditional Deploys**: Deploy solo cuando es necesario

### Monitoring
1. **Health Checks**: Verificación de aplicación desplegada
2. **Comprehensive Logging**: Logs detallados de cada step
3. **Artifact Storage**: Preservación de reportes

## 🔄 Flujo de Trabajo Recomendado

1. **Development**: Trabajo en feature branches
2. **Pull Request**: Trigger del pipeline completo
3. **Review**: Revisión de resultados de seguridad
4. **Merge**: Solo después de aprobar security checks
5. **Deploy**: Automático a producción desde main

## 📞 Soporte y Troubleshooting

### Logs Comunes
- Check GitHub Actions logs para detalles
- Revisa Security tab para vulnerabilidades
- Descarga artifacts para reportes completos

### Issues Frecuentes
1. **SonarQube Token**: Verifica SONAR_TOKEN secret
2. **Docker Build**: Revisa Dockerfile syntax
3. **ZAP Timeout**: Ajusta timeout en deploy step
4. **Trivy Scan**: Verifica conectividad a vulnerability DB

Este pipeline proporciona una base sólida para DevSecOps que puedes extender según tus necesidades específicas.
