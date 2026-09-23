import { IsInt, Min, IsString, MinLength, MaxLength } from 'class-validator';

export class RejeitarSolicitacaoDto {
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  motivo!: string;

  @IsInt()
  @Min(1)
  versao!: number;
}