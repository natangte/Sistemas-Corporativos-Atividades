import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { CentroCusto } from '../centro-custos/centro-custos.entity';

export type StatusSolicitacao = 'pendente' | 'aprovada' | 'rejeitada';
export type NivelPrioridade = 'normal' | 'urgente';

@Entity({ name: 'solicitacoes' })
export class Solicitacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

  @ManyToOne(() => CentroCusto, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto!: CentroCusto;

  @Column({
    name: 'valor_estimado',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  valorEstimado!: string;

  @Column({ type: 'varchar', length: 10, default: 'normal' })
  prioridade!: NivelPrioridade;

  @Column({ type: 'varchar', length: 20, default: 'pendente' })
  status!: StatusSolicitacao;

  @VersionColumn({ name: 'versao' })
  versao!: number;

  @CreateDateColumn({ name: 'criada_em', type: 'timestamptz' })
  criadaEm!: Date;

  @UpdateDateColumn({ name: 'atualizada_em', type: 'timestamptz' })
  atualizadaEm!: Date;
}