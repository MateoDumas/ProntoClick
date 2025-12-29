import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SupportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    if (user.role !== 'support' && user.role !== 'admin') {
      throw new ForbiddenException('No tienes permiso para acceder a esta funcionalidad. Se requiere rol de soporte.');
    }

    return true;
  }
}

