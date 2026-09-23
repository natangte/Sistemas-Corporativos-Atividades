import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  UsuarioAutenticado,
  UsuariosService,
} from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, senha: string) {
    const usuario = this.usuariosService.buscarPorEmail(email);

    if (!usuario || !usuario.ativo) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
      return null;
    }

    const { senhaHash: _senhaHash, ...principal } = usuario;
    return principal;
  }

  login(usuario: UsuarioAutenticado) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}