import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Auditoria } from '../auditoria/auditoria.entity';
import { CentroCusto } from '../centros-custo/centro-custo.entity';

import { CriarSolicitacaoDto } from './dto/criar-solicitacao.dto';
import { FiltrarSolicitacoesDto } from './dto/filtro-solicitacao.dto';
import { RejeitarSolicitacaoDto } from './dto/rejeitar-solicitacao.dto';
import {
  Solicitacao,
  StatusSolicitacao,
} from './solicitacao.entity';

@Injectable()
export class SolicitacoesService {
  constructor(
    @InjectRepository(Solicitacao)
    private readonly repository: Repository<Solicitacao>,

    private readonly dataSource: DataSource,
  ) {}

  async listar(filtros: FiltrarSolicitacoesDto) {
    const query = this.repository
      .createQueryBuilder('solicitacao')
      .leftJoinAndSelect(
        'solicitacao.centroCusto',
        'centroCusto',
      )
      .orderBy('solicitacao.id', 'ASC');

    if (filtros.status) {
      query.andWhere('solicitacao.status = :status', {
        status: filtros.status,
      });
    }

    if (filtros.centroCusto) {
      query.andWhere('centroCusto.codigo = :centroCusto', {
        centroCusto: filtros.centroCusto,
      });
    }

    if (filtros.prioridade) {
      query.andWhere(
        'solicitacao.prioridade = :prioridade',
        {
          prioridade: filtros.prioridade,
        },
      );
    }

    return query.getMany();
  }

  async buscarPorId(id: number) {
    const solicitacao = await this.repository
      .createQueryBuilder('solicitacao')
      .leftJoinAndSelect(
        'solicitacao.centroCusto',
        'centroCusto',
      )
      .where('solicitacao.id = :id', { id })
      .getOne();

    if (!solicitacao) {
      throw new NotFoundException(
        'Solicitação não encontrada',
      );
    }

    return solicitacao;
  }

  async criar(dto: CriarSolicitacaoDto) {
    const centroCusto = await this.dataSource
      .getRepository(CentroCusto)
      .findOneBy({
        codigo: dto.centroCusto,
      });

    if (!centroCusto) {
      throw new NotFoundException(
        'Centro de custo não encontrado',
      );
    }

    const solicitacao = this.repository.create({
      titulo: dto.titulo,
      centroCusto,
      valorEstimado: dto.valorEstimado,
      prioridade: dto.prioridade,
      status: 'pendente',
    });

    return this.repository.save(solicitacao);
  }

  async aprovar(
    id: number,
    versaoSolicitacaoEsperada: number,
    versaoCentroCustoEsperada: number,
    atorId: number,
  ) {
    return this.dataSource.transaction(
      async (manager) => {
        const solicitacao = await manager
          .getRepository(Solicitacao)
          .createQueryBuilder('solicitacao')
          .leftJoinAndSelect(
            'solicitacao.centroCusto',
            'centroCusto',
          )
          .where('solicitacao.id = :id', { id })
          .getOne();

        if (!solicitacao) {
          throw new NotFoundException(
            'Solicitação não encontrada',
          );
        }

        if (solicitacao.status !== 'pendente') {
          throw new ConflictException(
            'Solicitação não está pendente',
          );
        }

        if (
          solicitacao.versao !==
          versaoSolicitacaoEsperada
        ) {
          throw new ConflictException(
            'A versão da solicitação está desatualizada',
          );
        }

        const centroCusto = await manager
          .getRepository(CentroCusto)
          .findOneBy({
            id: solicitacao.centroCusto.id,
          });

        if (!centroCusto) {
          throw new NotFoundException(
            'Centro de custo não encontrado',
          );
        }

        if (
          centroCusto.versao !==
          versaoCentroCustoEsperada
        ) {
          throw new ConflictException(
            'A versão do centro de custo está desatualizada',
          );
        }

        const saldoAnterior =
          centroCusto.saldoDisponivel;

        const valorReservado =
          solicitacao.valorEstimado;

        const atualizacaoCentroCusto =
          await manager
            .createQueryBuilder()
            .update(CentroCusto)
            .set({
              saldoDisponivel: () =>
                '"saldo_disponivel" - :valor',
              versao: () => '"versao" + 1',
            })
            .where('id = :id', {
              id: centroCusto.id,
            })
            .andWhere(
              'versao = :versao',
              {
                versao: versaoCentroCustoEsperada,
              },
            )
            .andWhere(
              '"saldo_disponivel" >= :valor',
              {
                valor: valorReservado,
              },
            )
            .execute();

        if (atualizacaoCentroCusto.affected !== 1) {
          const centroAtual = await manager
            .getRepository(CentroCusto)
            .findOneBy({
              id: centroCusto.id,
            });

          if (
            centroAtual &&
            centroAtual.versao !==
              versaoCentroCustoEsperada
          ) {
            throw new ConflictException(
              'O centro de custo foi alterado; consulte novamente',
            );
          }

          throw new ConflictException(
            'Saldo insuficiente para aprovar a solicitação',
          );
        }

        const atualizacaoSolicitacao =
          await manager
            .createQueryBuilder()
            .update(Solicitacao)
            .set({
              status: 'aprovada',
              versao: () => '"versao" + 1',
            })
            .where('id = :id', { id })
            .andWhere(
              'versao = :versao',
              {
                versao:
                  versaoSolicitacaoEsperada,
              },
            )
            .andWhere(
              'status = :status',
              {
                status: 'pendente',
              },
            )
            .execute();

        if (atualizacaoSolicitacao.affected !== 1) {
          throw new ConflictException(
            'A solicitação foi alterada; consulte novamente',
          );
        }

        const centroCustoAtualizado =
          await manager
            .getRepository(CentroCusto)
            .findOneByOrFail({
              id: centroCusto.id,
            });

        await manager.insert(Auditoria, {
          atorId,
          acao: 'SOLICITACAO_APROVADA',
          recursoTipo: 'solicitacao',
          recursoId: id,
          detalhes: {
            centroCusto: centroCusto.codigo,
            valorReservado,
            saldoAnterior,
            saldoResultante:
              centroCustoAtualizado.saldoDisponivel,
            versaoSolicitacaoUtilizada:
              versaoSolicitacaoEsperada,
            versaoCentroCustoUtilizada:
              versaoCentroCustoEsperada,
            versaoSolicitacaoResultante:
              versaoSolicitacaoEsperada + 1,
            versaoCentroCustoResultante:
              versaoCentroCustoEsperada + 1,
            instanteOperacao: new Date().toISOString(),
          },
        });

        return manager
          .getRepository(Solicitacao)
          .createQueryBuilder('solicitacao')
          .leftJoinAndSelect(
            'solicitacao.centroCusto',
            'centroCusto',
          )
          .where('solicitacao.id = :id', { id })
          .getOneOrFail();
      },
    );
  }

  async rejeitar(
    id: number,
    versaoEsperada: number,
    atorId: number,
    motivo: string,
  ) {
    return this.dataSource.transaction(
      async (manager) => {
        const solicitacao = await manager.findOneBy(
          Solicitacao,
          { id },
        );

        if (!solicitacao) {
          throw new NotFoundException(
            'Solicitação não encontrada',
          );
        }

        if (solicitacao.status !== 'pendente') {
          throw new ConflictException(
            'Solicitação não está pendente',
          );
        }

        const resultado = await manager
          .createQueryBuilder()
          .update(Solicitacao)
          .set({
            status: 'rejeitada',
            versao: () => '"versao" + 1',
          })
          .where('id = :id', { id })
          .andWhere(
            'versao = :versao',
            {
              versao: versaoEsperada,
            },
          )
          .andWhere(
            'status = :status',
            {
              status: 'pendente',
            },
          )
          .execute();

        if (resultado.affected !== 1) {
          throw new ConflictException(
            'A solicitação foi alterada; consulte novamente',
          );
        }

        await manager.insert(Auditoria, {
          atorId,
          acao: 'SOLICITACAO_REJEITADA',
          recursoTipo: 'solicitacao',
          recursoId: id,
          motivo,
          detalhes: {
            statusAnterior: 'pendente',
            statusAtual: 'rejeitada',
            versaoAnterior: versaoEsperada,
          },
        });

        return manager.findOneByOrFail(
          Solicitacao,
          { id },
        );
      },
    );
  }
}