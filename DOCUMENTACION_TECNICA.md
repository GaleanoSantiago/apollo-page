# Documentación Técnica - Portal de Contratos Apollo

**Fecha de Actualización:** 09/01/2026
**Estado:** Funcional / Producción (Simulada)

## 1. Descripción General
Sistema web para la gestión, visualización y firma digital de contratos para clientes de Apollo. El sistema permite a los usuarios autenticarse, ver sus contratos asignados, firmarlos digitalmente con validación OTP y descargar una copia certificada.

## 2. Arquitectura Tecnológica
*   **Frontend:** HTML5, Bootstrap 5.2, JavaScript Vanilla.
*   **Backend / Auth:** Firebase (Authentication, Firestore).
*   **Generación PDF:** `pdf-lib` (Procesamiento en el cliente).
*   **Firmas:** `signature_pad` (Canvas HTML5).
*   **Emails:** EmailJS (Integración frontend).
*   **Alojamiento de Archivos:** Externo (Hostinger/GitHub) -> Se guardan URLs en Firestore. *No se usa Firebase Storage para evitar costos.*

## 3. Funcionalidades Clave

### A. Autenticación y Seguridad
*   Login protegido con Firebase Auth.
*   Rutas protegidas (`auth.onAuthStateChanged`) en Dashboard y Visor.
*   **Verificación OTP:** Antes de guardar una firma, se envía un código de 6 dígitos al email del usuario para validar su identidad.

### B. Dashboard (Mis Documentos)
*   **Vista de Tarjetas:** Diseño visual con tarjetas "Glassmorphism" (fondo translúcido).
*   **Estados:**
    *   🟡 **PENDIENTE:** Permite acceder a firmar.
    *   🟢 **FIRMADO:** Permite ver y descargar el documento final.

### C. Visor y Firma
*   **Layout:** Pantalla completa (`100vh`). PDF a la izquierda, Panel de firma a la derecha.
*   **Firma Digital:** Canvas amplio con fondo blanco.
*   **Proceso de Guardado:**
    1.  El usuario dibuja la firma.
    2.  Se genera imagen Base64.
    3.  Se solicita OTP.
    4.  Al validar, se guarda la firma Base64 directamente en el documento de Firestore (`contracts/{id}`).

### D. Certificado de Auditoría (Audit Trail)
Al renderizar un documento firmado, el sistema **dinámicamente**:
1.  Incrusta la imagen de la firma en la última página del PDF original.
2.  **Agrega una nueva página** al final con:
    *   ID del Documento.
    *   Fecha y Hora de firma.
    *   Email del firmante.
    *   Método de validación (OTP Email).
    *   Sello de "Certificado de Firma Digital".

## 4. Diseño y Estilos (Design System)
El portal respeta estrictamente la identidad de marca de Apollo:

*   **Fuentes:** `CalSans` (Títulos), `Figtree` (Cuerpo).
*   **Colores:**
    *   Fondo: Degradado Azul Oscuro (`#071328` a `#17385d`).
    *   Acento: Azul Brillante (`#3498db`).
    *   Botones Principales: Crema (`#faf2ce`) con texto azul.
*   **Estilo Visual:** "Glassmorphism" (Tarjetas semitransparentes con desenfoque `blur`).
*   **Imagen de Fondo:** `img/background/Seccion (1).png`.

## 5. Notas para el Desarrollador
*   **Firebase Config:** Se encuentra en `portal/js/firebase-config.js`. Usar sintaxis `compat` (`firebase.initializeApp`).
*   **EmailJS:** Actualmente en modo simulación (console.log). Para producción, configurar IDs reales en `viewer.html` y `viewer.js`.
*   **CORS:** Los PDFs deben estar alojados en un servidor que permita CORS (`Access-Control-Allow-Origin: *`) para que `pdf-lib` pueda editarlos.

---
*Este documento sirve como referencia para recuperar el contexto del proyecto.*
