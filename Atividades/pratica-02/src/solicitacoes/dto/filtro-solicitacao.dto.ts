import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type {
  NivelPrioridade,
  StatusSolicitacao,
} from '../solicitacao.entity';

export class FiltrarSolicitacoesDto {
  @IsOptional()
  @IsIn(['pendente', 'aprovada', 'rejeitada'])
  status?: StatusSolicitacao;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  centroCusto?: string;

  @IsOptional()
  @IsIn(['normal', 'urgente'])
  prioridade?: NivelPrioridade;
}