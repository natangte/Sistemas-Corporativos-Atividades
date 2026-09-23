import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsuarioAutenticado } from '../usuarios/usuarios.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

type RequisicaoAutenticada = {
  user: UsuarioAutenticado;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() request: RequisicaoAutenticada) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Req() request: RequisicaoAutenticada) {
    return request.user;
  }
}