import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetSupportPassword() {
  const supportEmail = process.env.SUPPORT_EMAIL || 'soporte@prontoclick.com';
  const supportPassword = process.env.SUPPORT_PASSWORD || 'Soporte123!';
  const supportName = process.env.SUPPORT_NAME || 'Soporte ProntoClick';

  try {
    console.log('🔍 Buscando usuario de soporte...');
    
    // Buscar usuario de soporte por email o por rol
    let supportUser = await prisma.user.findUnique({
      where: { email: supportEmail },
    });

    if (!supportUser) {
      // Si no existe por email, buscar por rol
      supportUser = await prisma.user.findFirst({
        where: { role: 'support' },
      });
    }

    if (!supportUser) {
      console.log('❌ No se encontró ningún usuario de soporte.');
      console.log('   Creando nuevo usuario de soporte...');
      
      // Crear nuevo usuario de soporte
      const hashedPassword = await bcrypt.hash(supportPassword, 10);
      supportUser = await prisma.user.create({
        data: {
          email: supportEmail,
          password: hashedPassword,
          name: supportName,
          role: 'support',
        },
      });
      
      console.log('✅ Usuario de soporte creado exitosamente!');
    } else {
      console.log('✅ Usuario de soporte encontrado:');
      console.log('   Email:', supportUser.email);
      console.log('   Nombre:', supportUser.name);
      console.log('   Rol:', supportUser.role);
      
      // Verificar si el email coincide
      if (supportUser.email !== supportEmail) {
        console.log(`\n⚠️  El email del usuario es "${supportUser.email}" pero se esperaba "${supportEmail}"`);
        console.log('   Actualizando email...');
        
        // Verificar si el nuevo email ya está en uso
        const emailInUse = await prisma.user.findUnique({
          where: { email: supportEmail },
        });
        
        if (emailInUse && emailInUse.id !== supportUser.id) {
          console.log('❌ El email ya está en uso por otro usuario.');
          console.log('   Usando el email existente del usuario de soporte.');
        } else {
          supportUser = await prisma.user.update({
            where: { id: supportUser.id },
            data: { email: supportEmail },
          });
          console.log('✅ Email actualizado correctamente.');
        }
      }
      
      // Resetear la contraseña
      console.log('\n🔄 Reseteando contraseña...');
      const hashedPassword = await bcrypt.hash(supportPassword, 10);
      supportUser = await prisma.user.update({
        where: { id: supportUser.id },
        data: { password: hashedPassword },
      });
      console.log('✅ Contraseña reseteada exitosamente!');
    }

    console.log('\n📝 Credenciales de acceso:');
    console.log('   Email:', supportUser.email);
    console.log('   Password:', supportPassword);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión!');
    
    // Verificar que la contraseña funciona
    console.log('\n🔐 Verificando contraseña...');
    const isPasswordValid = await bcrypt.compare(supportPassword, supportUser.password);
    if (isPasswordValid) {
      console.log('✅ La contraseña se ha verificado correctamente.');
    } else {
      console.log('❌ ERROR: La contraseña no coincide después del reset.');
      console.log('   Esto no debería pasar. Por favor, verifica el código.');
    }
  } catch (error) {
    console.error('❌ Error al resetear contraseña de soporte:', error);
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message);
      console.error('   Stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetSupportPassword();

