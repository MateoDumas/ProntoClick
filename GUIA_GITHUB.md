# 🚀 Guía para Subir el Repositorio a GitHub

## 📋 Pasos para Crear y Subir el Repositorio

### 1. Crear el Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Completa el formulario:
   - **Repository name:** `ProntoClick` (o el nombre que prefieras)
   - **Description:** "Aplicación de delivery de comida rápida con sistema de chat inteligente"
   - **Visibility:** Elige **Public** o **Private**
   - ⚠️ **NO marques** "Initialize this repository with a README" (ya tenemos uno)
   - ⚠️ **NO agregues** .gitignore ni licencia (ya los tenemos)
4. Haz clic en **"Create repository"**

### 2. Conectar tu Repositorio Local con GitHub

Después de crear el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos en tu terminal:

```bash
# Asegúrate de estar en la raíz del proyecto
cd C:\Users\mateo\Documents\ProntoClick

# Agrega el remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/ProntoClick.git

# Verifica que se agregó correctamente
git remote -v
```

### 3. Subir el Código a GitHub

```bash
# Cambia a la rama main (si es necesario)
git branch -M main

# Sube el código
git push -u origin main
```

Si te pide credenciales:
- **Usuario:** Tu usuario de GitHub
- **Contraseña:** Usa un **Personal Access Token** (no tu contraseña normal)

### 4. Crear un Personal Access Token (si es necesario)

Si GitHub te pide autenticación:

1. Ve a GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Haz clic en **"Generate new token (classic)"**
3. Configura:
   - **Note:** "ProntoClick Local"
   - **Expiration:** Elige una duración
   - **Scopes:** Marca **`repo`** (acceso completo a repositorios)
4. Haz clic en **"Generate token"**
5. **Copia el token** (solo se muestra una vez)
6. Úsalo como contraseña cuando Git te la pida

---

## 🔄 Comandos Útiles para el Futuro

### Subir cambios
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver el estado
```bash
git status
```

### Ver el historial
```bash
git log --oneline
```

### Crear una nueva rama
```bash
git checkout -b nombre-de-la-rama
git push -u origin nombre-de-la-rama
```

---

## ✅ Verificación

Después de subir, verifica que todo esté bien:

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/ProntoClick`
2. Deberías ver todos tus archivos
3. El README.md debería aparecer en la página principal

---

## 🚨 Problemas Comunes

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/ProntoClick.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error de autenticación
- Asegúrate de usar un **Personal Access Token**, no tu contraseña
- O configura SSH keys (más avanzado)

---

**¡Listo! Tu código está en GitHub 🎉**

