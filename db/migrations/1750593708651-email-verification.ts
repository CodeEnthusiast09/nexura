import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerification1750593708651 implements MigrationInterface {
    name = 'EmailVerification1750593708651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationTokenExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationToken"`);
    }

}
