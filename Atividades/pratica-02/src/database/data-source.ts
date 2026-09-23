import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Auditoria } from '../auditoria/auditoria.entity';
import { CentroCusto } from '../centro-custos/centro-custos.entity';
import { Solicitacao } from '../solicitacoes/solicitacao.entity';

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,

  port: Number(
    process.env.DB_PORT ?? 5432,
  ),

  database: process.env.DB_NAME,

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  entities: [
    Solicitacao,
    CentroCusto,
    Auditoria,
  ],

  migrations: [
    'src/database/migrations/*{.ts,.js}',
  ],

  synchronize: false,
});