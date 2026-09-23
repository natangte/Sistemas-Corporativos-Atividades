import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { SolicitacoesService } from './solicitacoes.service';
import { CriarSolicitacaoDto } from './dto/criar-solicitacao.dto';
import { FiltrarSolicitacoesDto } from './dto/filtro-solicitacao.dto';
import { AprovarSolicitacaoDto } from './dto/aprovar-solicitacao.dto';
import { RejeitarSolicitacaoDto } from './dto/rejeitar-solicitacao.dto';

type RequisicaoAutenticada = {
  user: {
    id: number;
    papel: string;
  };
};

@Controller('solicitacoes')
export class SolicitacoesController {
  constructor(
    private readonly solicitacoesService: SolicitacoesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  criar(@Body() dto: CriarSolicitacaoDto) {
    return this.solicitacoesService.criar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listar(
    @Query() filtros: FiltrarSolicitacoesDto,
  ) {
    return this.solicitacoesService.listar(filtros);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.solicitacoesService.buscarPorId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('gestor')
  @Patch(':id/aprovar')
  aprovar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AprovarSolicitacaoDto,
    @Req() request: RequisicaoAutenticada,
  ) {
    return this.solicitacoesService.aprovar(
      id,
      dto.versaoSolicitacao,
      dto.versaoCentroCusto,
      request.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('gestor')
  @Patch(':id/rejeitar')
  rejeitar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejeitarSolicitacaoDto,
    @Req() request: RequisicaoAutenticada,
  ) {
    return this.solicitacoesService.rejeitar(
      id,
      dto.versao,
      request.user.id,
      dto.motivo,
    );
  }
}