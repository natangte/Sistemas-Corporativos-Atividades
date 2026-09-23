import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Papel } from '../../usuarios/usuarios.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const papeisExigidos = this.reflector.getAllAndOverride<Papel[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!papeisExigidos?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return papeisExigidos.includes(request.user?.papel);
  }
}