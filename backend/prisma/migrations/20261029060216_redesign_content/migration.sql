-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "PromoFormat" AS ENUM ('POPUP', 'BANNER', 'CARD');

-- CreateEnum
CREATE TYPE "PromoTheme" AS ENUM ('DEFAULT', 'DIWALI', 'VALENTINES', 'NEW_YEAR', 'GANESH_CHATURTHI', 'ANNIVERSARY');

-- CreateEnum
CREATE TYPE "PromoFrequency" AS ENUM ('EVERY_VISIT', 'ONCE_PER_SESSION', 'ONCE_PER_DAY', 'ONCE_PER_WEEK', 'ONCE');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "rating" INTEGER,
    "photoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "posterUrl" TEXT,
    "caption" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "terms" TEXT,
    "imageUrl" TEXT,
    "theme" "PromoTheme" NOT NULL DEFAULT 'DEFAULT',
    "emojis" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "format" "PromoFormat" NOT NULL DEFAULT 'POPUP',
    "frequency" "PromoFrequency" NOT NULL DEFAULT 'ONCE_PER_DAY',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimonial_isActive_displayOrder_idx" ON "Testimonial"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "GalleryItem_isActive_displayOrder_idx" ON "GalleryItem"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "Promotion_isActive_startsAt_endsAt_idx" ON "Promotion"("isActive", "startsAt", "endsAt");
