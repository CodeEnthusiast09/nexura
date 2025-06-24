import { MigrationInterface, QueryRunner } from "typeorm";

export class OtpVerification1750722393962 implements MigrationInterface {
    name = 'OtpVerification1750722393962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" ADD "tempToken" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "UQ_d82c0a8ff3708452cc02d66b5e1" UNIQUE ("tempToken")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "UQ_d82c0a8ff3708452cc02d66b5e1"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "tempToken"`);
    }

}
