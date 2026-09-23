import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1789066112018 implements MigrationInterface {
    name = 'Inicial1789066112018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "solicitacoes" ("id" SERIAL NOT NULL, "titulo" character varying(150) NOT NULL, "centroCusto" character varying(30) NOT NULL, "prioridade" character varying(10) NOT NULL DEFAULT 'normal', "status" character varying(20) NOT NULL DEFAULT 'pendente', "versao" integer NOT NULL, "criada_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizada_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_795aaa33114295368cac771de45" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "solicitacoes"`);
    }

}
