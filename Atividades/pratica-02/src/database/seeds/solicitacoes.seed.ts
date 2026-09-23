import 'dotenv/config';
import dataSource from '../data-source';
import { CentroCusto } from '../../centro-custos/centro-custos.entity';
import { Solicitacao } from '../../solicitacoes/solicitacao.entity';

const CODIGO_CENTRO_CUSTO = 'CC-1234';

const dados = [
  {
    titulo: 'Aquisição de monitor',
    valorEstimado: '1200.00',
    prioridade: 'normal' as const,
  },
  {
    titulo: 'Aquisição de servidores',
    valorEstimado: '6000.00',
    prioridade: 'urgente' as const,
  },
];

async function executar() {
  await dataSource.initialize();

  const centroCustoRepository =
    dataSource.getRepository(CentroCusto);

  const solicitacaoRepository =
    dataSource.getRepository(Solicitacao);

  let centroCusto =
    await centroCustoRepository.findOneBy({
      codigo: CODIGO_CENTRO_CUSTO,
    });

  if (!centroCusto) {
    centroCusto = await centroCustoRepository.save(
      centroCustoRepository.create({
        codigo: CODIGO_CENTRO_CUSTO,
        saldoDisponivel: '5000.00',
        versao: 1,
      }),
    );
  }

  for (const item of dados) {
    const existente =
      await solicitacaoRepository
        .createQueryBuilder('solicitacao')
        .leftJoin('solicitacao.centroCusto', 'centroCusto')
        .where(
          'solicitacao.titulo = :titulo',
          {
            titulo: item.titulo,
          },
        )
        .andWhere(
          'centroCusto.id = :centroCustoId',
          {
            centroCustoId: centroCusto.id,
          },
        )
        .getOne();

    if (!existente) {
      await solicitacaoRepository.save(
        solicitacaoRepository.create({
          titulo: item.titulo,
          centroCusto,
          valorEstimado: item.valorEstimado,
          prioridade: item.prioridade,
          status: 'pendente',
        }),
      );
    }
  }

  await dataSource.destroy();
}

executar().catch(async (erro) => {
  console.error(erro);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exitCode = 1;
});