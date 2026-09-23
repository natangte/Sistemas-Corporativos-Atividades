import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionarCentrosCusto1790000000000
  implements MigrationInterface
{
  name = 'AdicionarCentrosCusto1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "centros_custo" (
        "id" SERIAL NOT NULL,
        "codigo" character varying(30) NOT NULL,
        "saldo_disponivel" numeric(12,2) NOT NULL,
        "versao" integer NOT NULL DEFAULT 1,
        CONSTRAINT "PK_centros_custo_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "UQ_centros_custo_codigo"
          UNIQUE ("codigo"),
        CONSTRAINT "CHK_centros_custo_saldo_nao_negativo"
          CHECK ("saldo_disponivel" >= 0),
        CONSTRAINT "CHK_centros_custo_versao_positiva"
          CHECK ("versao" >= 1)
      )
    `);

    await queryRunner.query(`
      INSERT INTO "centros_custo" ("codigo", "saldo_disponivel", "versao")
      VALUES
        ('TI-DEV', 0.00, 1),
        ('TI-INFRA', 0.00, 1)
      ON CONFLICT ("codigo") DO NOTHING
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD "valor_estimado" numeric(12,2) NOT NULL DEFAULT 0.00
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD "centro_custo_id" integer
    `);

    await queryRunner.query(`
      UPDATE "solicitacoes" s
      SET "centro_custo_id" = c."id"
      FROM "centros_custo" c
      WHERE c."codigo" = s."centroCusto"
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ALTER COLUMN "centro_custo_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD CONSTRAINT "FK_solicitacoes_centro_custo"
      FOREIGN KEY ("centro_custo_id")
      REFERENCES "centros_custo"("id")
      ON DELETE RESTRICT
      ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD CONSTRAINT "CHK_solicitacoes_valor_estimado_nao_negativo"
      CHECK ("valor_estimado" >= 0)
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP COLUMN "centroCusto"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      ADD "centroCusto" character varying(30)
    `);

    await queryRunner.query(`
      UPDATE "solicitacoes" s
      SET "centroCusto" = c."codigo"
      FROM "centros_custo" c
      WHERE c."id" = s."centro_custo_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP CONSTRAINT "CHK_solicitacoes_valor_estimado_nao_negativo"
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP CONSTRAINT "FK_solicitacoes_centro_custo"
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP COLUMN "centro_custo_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "solicitacoes"
      DROP COLUMN "valor_estimado"
    `);

    await queryRunner.query(`
      DROP TABLE "centros_custo"
    `);
  }
}