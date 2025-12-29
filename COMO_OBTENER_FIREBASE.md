# 🔥 Cómo Obtener Credenciales de Firebase Cloud Messaging

## 📋 Pasos Detallados

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Ingresa el nombre del proyecto (ej: "ProntoClick")
4. Sigue los pasos del asistente
5. **No es necesario** habilitar Google Analytics (puedes desactivarlo)

---

### 2. Obtener Service Account JSON (Para Backend)

1. En Firebase Console, ve a **⚙️ Configuración del proyecto** (Project Settings)
2. Ve a la pestaña **"Service accounts"**
3. Haz clic en **"Generar nueva clave privada"** (Generate new private key)
4. Se descargará un archivo JSON (ej: `prontoclick-firebase-adminsdk-xxxxx.json`)

5. **Agregar al `.env` del Backend:**
   ```env
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
   ```

   **⚠️ IMPORTANTE:** 
   - Copia TODO el contenido del JSON
   - Reemplaza las comillas dobles internas con `\"`
   - O mejor: usa el archivo JSON directamente (ver opción alternativa abajo)

**Opción Alternativa (Más Fácil):**
   - Guarda el archivo JSON en `Backend/firebase-service-account.json`
   - Modifica `push-notifications.service.ts` para leer el archivo directamente

---

### 3. Obtener VAPID Key (Para Frontend - Opcional)

1. En Firebase Console, ve a **⚙️ Configuración del proyecto**
2. Ve a la pestaña **"Cloud Messaging"**
3. En **"Web Push certificates"**, haz clic en **"Generate key pair"**
4. Copia la clave pública generada

5. **Agregar al `.env.local` del Frontend:**
   ```env
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_vapid_key_aqui
   ```

---

## ⚠️ Nota Importante

**Las notificaciones push FUNCIONAN SIN Firebase** usando la API nativa del navegador. Firebase es opcional y solo necesario para:
- Notificaciones más avanzadas
- Mejor gestión de tokens
- Analytics de notificaciones
- Notificaciones cross-platform

**Para empezar, puedes usar la implementación actual sin Firebase.**

---

## 🔗 Enlaces Directos

- [Firebase Console](https://console.firebase.google.com/)
- [Documentación FCM](https://firebase.google.com/docs/cloud-messaging)

