import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'auditorias' })
export class Auditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ator_id', type: 'int' })
  atorId!: number;

  @Column({ type: 'varchar', length: 50 })
  acao!: string;

  @Column({ name: 'recurso_tipo', type: 'varchar', length: 50 })
  recursoTipo!: string;

  @Column({ name: 'recurso_id', type: 'int' })
  recursoId!: number;

  @Column({name: 'motivo', type: 'varchar', length: 50, nullable: true})
  motivo?: string;

  @Column({ type: 'jsonb', nullable: true })
  detalhes!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'criada_em', type: 'timestamptz' })
  criadaEm!: Date;
}