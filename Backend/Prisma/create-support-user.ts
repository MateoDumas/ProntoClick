import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSupportUser() {
  const supportEmail = process.env.SUPPORT_EMAIL || 'soporte@prontoclick.com';
  const supportPassword = process.env.SUPPORT_PASSWORD || 'Soporte123!';
  const supportName = process.env.SUPPORT_NAME || 'Soporte ProntoClick';

  try {
    // Verificar si ya existe un usuario de soporte
    const existingSupport = await prisma.user.findFirst({
      where: {
        role: 'support',
      },
    });

    if (existingSupport) {
      console.log('✅ Ya existe un usuario de soporte:', existingSupport.email);
      console.log('   Si quieres crear uno nuevo, elimina el existente primero.');
      return;
    }

    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: supportEmail },
    });

    if (existingUser) {
      console.log('❌ El email ya está en uso por otro usuario.');
      console.log('   Email:', supportEmail);
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(supportPassword, 10);

    // Crear usuario de soporte
    const supportUser = await prisma.user.create({
      data: {
        email: supportEmail,
        password: hashedPassword,
        name: supportName,
        role: 'support',
      },
    });

    console.log('✅ Usuario de soporte creado exitosamente!');
    console.log('   Email:', supportUser.email);
    console.log('   Nombre:', supportUser.name);
    console.log('   Rol:', supportUser.role);
    console.log('\n📝 Credenciales de acceso:');
    console.log('   Email:', supportEmail);
    console.log('   Password:', supportPassword);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión!');
  } catch (error) {
    console.error('❌ Error al crear usuario de soporte:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSupportUser();

