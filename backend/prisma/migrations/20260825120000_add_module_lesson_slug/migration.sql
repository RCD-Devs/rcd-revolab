-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "slug" TEXT;
ALTER TABLE "Lesson" ADD COLUMN     "slug" TEXT;

-- Backfill: slug derivado de la posicion (ROW_NUMBER, no la columna "order"
-- directo, por si hubiera valores de "order" duplicados en filas viejas)
-- al momento de esta migracion. Queda fijo desde aca en adelante, no se
-- recalcula si despues se reordena.
WITH numbered_modules AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "courseId" ORDER BY "order" ASC, "id" ASC) AS rn
  FROM "Module"
)
UPDATE "Module" m
SET "slug" = 'modulo-' || numbered_modules.rn
FROM numbered_modules
WHERE m."id" = numbered_modules."id";

WITH numbered_lessons AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "moduleId" ORDER BY "order" ASC, "id" ASC) AS rn
  FROM "Lesson"
)
UPDATE "Lesson" l
SET "slug" = 'leccion-' || numbered_lessons.rn
FROM numbered_lessons
WHERE l."id" = numbered_lessons."id";

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Lesson" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Module_courseId_slug_key" ON "Module"("courseId", "slug");
CREATE UNIQUE INDEX "Lesson_moduleId_slug_key" ON "Lesson"("moduleId", "slug");
