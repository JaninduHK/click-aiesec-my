-- AlterTable
ALTER TABLE "ClickEvent" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "designation" TEXT,
ADD COLUMN     "lc" TEXT;
