# Banksofka

Este proyecto es una aplicación Angular que sirve como el frontend para el sistema Banksofka. Está diseñado para interactuar con dos APIs backend:
- **Bank API**: Proporciona servicios relacionados con la gestión de cuentas y transacciones.
- **Reactive API**: Proporciona servicios en tiempo real para streaming de transacciones.

El proyecto incluye un pipeline de CI/CD que automatiza la construcción, pruebas, análisis de código y despliegue de la aplicación.

## Guía de Usuario

### Funcionalidades Principales

- **Autenticación Segura**: Registro e inicio de sesión de usuarios con validación de datos
- **Gestión de Cuentas**: Visualización de saldos y detalles de cuenta
- **Operaciones Bancarias**:
- Depósitos
- Retiros
- Consulta de historial de transacciones
- **Notificaciones**: Alertas sobre operaciones realizadas

### Cómo Usar la Aplicación

1. **Configurar variables de entorno**:
El proyecto utiliza variables de entorno para configurar las URLs de las APIs. Crea un archivo src/environments/environment.ts con el siguiente contenido:

```bash
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api', // URL de la Bank API
    reactiveApiUrl: 'http://localhost:8081/api', // URL de la Reactive API
  };
```

3. **Inicio de Sesión**:

- Accede a través de la URL localhost:4200
- Ingresa tus credenciales o regístrate si eres nuevo usuario

3. **Operaciones Bancarias**:

- Selecciona el tipo de operación desde el menú principal
- Ingresa el monto para completar la transacción

4. **Consulta de Historial**:

- Accede a la sección "Historial"

### Requisitos para Usuarios

- Conexión a Internet estable
- Datos de registro válidos

### Tecnologías Utilizadas

- Angular 16
- Bootstrap
- TypeScript
- RxJS

### Arquitectura del Proyecto

- **Patrón de Diseño**: Arquitectura basada en componentes siguiendo los principios de Angular
- **Estado**: Gestión de estado mediante servicios y RxJS
- **API**: Comunicación RESTful con backend mediante HttpClient


Pipeline de CI/CD
El proyecto utiliza GitHub Actions para automatizar la construcción, pruebas y despliegue de la aplicación. El pipeline consta de dos jobs:

1. Build
Verifica el código.

Instala dependencias.

Ejecuta pruebas unitarias y genera un reporte de cobertura.

Realiza un análisis de código con SonarCloud.

2. Publish
Construye y publica la imagen Docker en GitHub Container Registry.

Usa las variables de entorno BANK_API_URL y REACTIVE_API_URL para configurar las URLs de las APIs en producción.

Secrets requeridos
SONAR_TOKEN: Token de SonarCloud para el análisis de código.

GHCR_TOKEN: Token de GitHub Container Registry para publicar la imagen.

BANK_API_URL: URL de la Bank API en producción.

REACTIVE_API_URL: URL de la Reactive API en producción.

Estructura del proyecto
src/: Contiene el código fuente de la aplicación Angular.

app/: Módulos, componentes y servicios de la aplicación.

environments/: Configuración de entornos (desarrollo y producción).

Dockerfile: Archivo para construir la imagen Docker.

.github/workflows/ci-cd.yml: Configuración del pipeline de CI/CD.

package.json: Dependencias y scripts del proyecto.


