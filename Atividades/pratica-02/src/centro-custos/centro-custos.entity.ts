import {
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'centros_custo' })
@Unique('UQ_centros_custo_codigo', ['codigo'])
@Check('CHK_centros_custo_saldo_nao_negativo', '"saldo_disponivel" >= 0')
@Check('CHK_centros_custo_versao_positiva', '"versao" >= 1')
export class CentroCusto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 30 })
  codigo!: string;

  @Column({
    name: 'saldo_disponivel',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  saldoDisponivel!: string;

  @Column({ type: 'integer', default: 1 })
  versao!: number;
}