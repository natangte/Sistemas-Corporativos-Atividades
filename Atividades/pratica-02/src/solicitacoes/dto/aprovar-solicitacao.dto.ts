import { IsInt, Min } from 'class-validator';

export class AprovarSolicitacaoDto {
  @IsInt()
  @Min(1)
  versaoSolicitacao!: number;

  @IsInt()
  @Min(1)
  versaoCentroCusto!: number;
}