import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentroCusto } from './centro-custos.entity';
import { CentrosCustoController } from './centro-custos.controller';
import { CentrosCustoService } from './centro-custos.service';

@Module({
  imports: [TypeOrmModule.forFeature([CentroCusto])],
  controllers: [CentrosCustoController],
  providers: [CentrosCustoService],
  exports: [TypeOrmModule],
})
export class CentrosCustoModule {}