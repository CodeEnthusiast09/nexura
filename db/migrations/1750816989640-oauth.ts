import { MigrationInterface, QueryRunner } from "typeorm";

export class Oauth1750816989640 implements MigrationInterface {
    name = 'Oauth1750816989640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    }

}
