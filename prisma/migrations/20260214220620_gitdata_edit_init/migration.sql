/*
  Warnings:

  - You are about to drop the column `userId` on the `github_commits` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `github_installations` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `github_commits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `github_installations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "github_commits" DROP CONSTRAINT "github_commits_userId_fkey";

-- DropForeignKey
ALTER TABLE "github_installations" DROP CONSTRAINT "github_installations_userId_fkey";

-- DropIndex
DROP INDEX "github_commits_userId_created_at_idx";

-- DropIndex
DROP INDEX "github_installations_userId_idx";

-- AlterTable
ALTER TABLE "github_commits" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "github_installations" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "github_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "github_commits_user_id_created_at_idx" ON "github_commits"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "github_installations_user_id_idx" ON "github_installations"("user_id");

-- AddForeignKey
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_commits" ADD CONSTRAINT "github_commits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
