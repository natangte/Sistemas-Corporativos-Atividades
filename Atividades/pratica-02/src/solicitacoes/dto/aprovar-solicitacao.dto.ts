import { IsInt, Min } from 'class-validator';

export class AprovarSolicitacaoDto {
  @IsInt()
  @Min(1)
  versao!: number;
}