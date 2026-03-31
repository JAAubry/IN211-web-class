/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class ChangeTitreToTitle1774949398293 {
    name = 'ChangeTitreToTitle1774949398293'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME COLUMN "titre" TO "title"
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME COLUMN "title" TO "titre"
        `);
    }
}
