import 'dotenv/config';
import dataSource from '../data-source';
import { Solicitacao } from '../../solicitacoes/solicitacao.entity';

const dados = [
  {
    titulo: 'Aquisição de monitor',
    centroCusto: 'TI-DEV',
    prioridade: 'normal' as const,
  },
  {
    titulo: 'Substituição de servidor',
    centroCusto: 'TI-INFRA',
    prioridade: 'urgente' as const,
  },
];

async function executar() {
  await dataSource.initialize();
  const repository = dataSource.getRepository(Solicitacao);

  for (const item of dados) {
    const existente = await repository.findOneBy({ titulo: item.titulo });

    if (!existente) {
      await repository.save(
        repository.create({
          ...item,
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