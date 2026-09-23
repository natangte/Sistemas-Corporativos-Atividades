import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Solicitacao } from './solicitacao.entity';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { Auditoria } from '../auditoria/auditoria.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Solicitacao, Auditoria])],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
})
export class SolicitacoesModule {}