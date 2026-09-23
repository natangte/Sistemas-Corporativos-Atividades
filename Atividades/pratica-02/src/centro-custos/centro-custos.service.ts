import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCusto } from './centro-custos.entity';

@Injectable()
export class CentrosCustoService {
  constructor(
    @InjectRepository(CentroCusto)
    private readonly repository: Repository<CentroCusto>,
  ) {}

  async buscarPorCodigo(codigo: string) {
    const centroCusto = await this.repository.findOneBy({ codigo });

    if (!centroCusto) {
      throw new NotFoundException('Centro de custo não encontrado');
    }

    return {
      codigo: centroCusto.codigo,
      saldoDisponivel: centroCusto.saldoDisponivel,
      versao: centroCusto.versao,
    };
  }
}