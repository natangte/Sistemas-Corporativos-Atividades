import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CentroCusto } from '../centro-custos/centro-custos.entity';
import { Auditoria } from '../auditoria/auditoria.entity';
import { Solicitacao } from './solicitacao.entity';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Solicitacao,
      Auditoria,
      CentroCusto,
    ]),
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
})
export class SolicitacoesModule {}