import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1789067543802 implements MigrationInterface {
    name = 'Inicial1789067543802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auditorias" ("id" SERIAL NOT NULL, "ator_id" integer NOT NULL, "acao" character varying(50) NOT NULL, "recurso_tipo" character varying(50) NOT NULL, "recurso_id" integer NOT NULL, "detalhes" jsonb, "criada_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b84b3505f313ab1a44e7b684ee2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auditorias"`);
    }

}
