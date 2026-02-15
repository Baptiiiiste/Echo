-- CreateTable
CREATE TABLE "github_commits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_commits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "github_commits_userId_created_at_idx" ON "github_commits"("userId", "created_at");

-- AddForeignKey
ALTER TABLE "github_commits" ADD CONSTRAINT "github_commits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
