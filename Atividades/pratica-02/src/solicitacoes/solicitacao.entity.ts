import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export type StatusSolicitacao = 'pendente' | 'aprovada' | 'rejeitada';
export type NivelPrioridade = 'normal' | 'urgente';

@Entity({ name: 'solicitacoes' })
export class Solicitacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

  @Column({ type: 'varchar', length: 30 })
  centroCusto!: string;

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