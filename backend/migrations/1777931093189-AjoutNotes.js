/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AjoutNotes1777931093189 {
    name = 'AjoutNotes1777931093189'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "note" (
                "id" SERIAL NOT NULL,
                "content" character varying NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_favourites_movie" (
                "userId" integer NOT NULL,
                "movieId" integer NOT NULL,
                CONSTRAINT "PK_98dd2650b92eff0fd2efe425a05" PRIMARY KEY ("userId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c47151f44961966d86268cd17b" ON "user_favourites_movie" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86768863c021fabcbacd81a790" ON "user_favourites_movie" ("movieId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstname"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastname"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "date"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "poster" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "note"
            ADD CONSTRAINT "FK_7c0b4c5c7b0c6f43ac6dceb0a6a" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_favourites_movie"
            ADD CONSTRAINT "FK_c47151f44961966d86268cd17bf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_favourites_movie"
            ADD CONSTRAINT "FK_86768863c021fabcbacd81a7907" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user_favourites_movie" DROP CONSTRAINT "FK_86768863c021fabcbacd81a7907"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_favourites_movie" DROP CONSTRAINT "FK_c47151f44961966d86268cd17bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP CONSTRAINT "FK_7c0b4c5c7b0c6f43ac6dceb0a6a"
        `);
        await queryRunner.query(`
            ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "poster"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "date" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastname" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstname" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_86768863c021fabcbacd81a790"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c47151f44961966d86268cd17b"
        `);
        await queryRunner.query(`
            DROP TABLE "user_favourites_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "note"
        `);
    }
}
