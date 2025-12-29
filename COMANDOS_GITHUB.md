# 🚀 Comandos para Subir a GitHub

## Paso 1: Crear el Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Repository name:** `ProntoClick`
3. **Description:** "Aplicación de delivery de comida rápida con sistema de chat inteligente"
4. **Visibility:** Elige Public o Private
5. ⚠️ **NO marques** "Add a README file"
6. ⚠️ **NO agregues** .gitignore ni licencia
7. Haz clic en **"Create repository"**

## Paso 2: Ejecutar estos comandos

Después de crear el repositorio, ejecuta estos comandos en tu terminal:

```bash
# Conectar con GitHub
git remote add origin https://github.com/MateoDumas/ProntoClick.git

# Cambiar a rama main
git branch -M main

# Subir el código
git push -u origin main
```

## Si te pide credenciales:

**Usuario:** `MateoDumas`

**Contraseña:** Necesitas un **Personal Access Token** (no tu contraseña normal)

### Crear Personal Access Token:

1. Ve a: https://github.com/settings/tokens
2. Clic en **"Generate new token (classic)"**
3. **Note:** "ProntoClick Local"
4. **Expiration:** Elige una duración
5. Marca el scope **`repo`** (acceso completo)
6. Clic en **"Generate token"**
7. **Copia el token** (solo se muestra una vez)
8. Úsalo como contraseña cuando Git te la pida

---

**¡Listo! Después de ejecutar estos comandos, tu código estará en GitHub 🎉**

