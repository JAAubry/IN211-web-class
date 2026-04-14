/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddPasswordToUsers1775553761874 {
    name = 'AddPasswordToUsers1775553761874'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying NOT NULL
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    }
}
