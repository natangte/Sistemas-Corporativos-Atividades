import {
  IsDecimal,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { NivelPrioridade } from '../solicitacao.entity';

export class CriarSolicitacaoDto {
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  titulo!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  centroCusto!: string;

  @IsDecimal(
    {
      decimal_digits: '0,2',
      force_decimal: true,
    },
    {
      message: 'valorEstimado deve possuir no máximo duas casas decimais',
    },
  )
  valorEstimado!: string;

  @IsString()
  @IsIn(['normal', 'urgente'])
  prioridade!: NivelPrioridade;
}