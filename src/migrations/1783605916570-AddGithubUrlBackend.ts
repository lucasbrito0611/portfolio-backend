import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGithubUrlBackend1783605916570 implements MigrationInterface {
    name = 'AddGithubUrlBackend1783605916570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "githubUrlBackend" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "githubUrlBackend"`);
    }

}
