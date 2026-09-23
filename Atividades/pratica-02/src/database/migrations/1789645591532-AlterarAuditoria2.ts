import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterarAuditoria21789645591532 implements MigrationInterface {
    name = 'AlterarAuditoria21789645591532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditorias" ADD "motivo" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditorias" DROP COLUMN "motivo"`);
    }

}
