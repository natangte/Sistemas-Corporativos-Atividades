import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CentrosCustoService } from './centro-custos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('centros-custo')
export class CentrosCustoController {
  constructor(
    private readonly centrosCustoService: CentrosCustoService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':codigo')
  buscarPorCodigo(@Param('codigo') codigo: string) {
    return this.centrosCustoService.buscarPorCodigo(codigo);
  }
}