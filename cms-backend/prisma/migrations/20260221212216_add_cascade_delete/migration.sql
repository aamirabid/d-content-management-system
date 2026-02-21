-- DropForeignKey
ALTER TABLE "BlogTranslation" DROP CONSTRAINT "BlogTranslation_blogId_fkey";

-- DropForeignKey
ALTER TABLE "NewsTranslation" DROP CONSTRAINT "NewsTranslation_newsId_fkey";

-- AddForeignKey
ALTER TABLE "BlogTranslation" ADD CONSTRAINT "BlogTranslation_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsTranslation" ADD CONSTRAINT "NewsTranslation_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
