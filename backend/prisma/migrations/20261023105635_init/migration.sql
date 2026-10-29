-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "TrainerGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('UNISEX', 'LADIES_ONLY');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'ON_REQUEST');

-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('MEMBERSHIP', 'HYROX', 'YOGA', 'SUPPLEMENTS', 'STEAM_MASSAGE', 'LADIES_SESSIONS', 'GENERAL');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "marathiName" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "googleRating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "mapUrl" TEXT,
    "openingInfo" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "gender" "TrainerGender" NOT NULL,
    "isMainTrainer" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "imageUrl" TEXT,
    "specializations" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "imageUrl" TEXT,
    "pricePaise" INTEGER,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "pricePaise" INTEGER,
    "benefits" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymTiming" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GymTiming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplement" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT,
    "description" TEXT,
    "size" TEXT,
    "pricePaise" INTEGER,
    "stockStatus" "StockStatus" NOT NULL DEFAULT 'ON_REQUEST',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "enquiryType" "EnquiryType" NOT NULL DEFAULT 'GENERAL',
    "preferredVisitTime" TEXT,
    "message" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_name_key" ON "Trainer"("name");

-- CreateIndex
CREATE INDEX "Trainer_isActive_displayOrder_idx" ON "Trainer"("isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_isActive_displayOrder_idx" ON "Service"("isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPlan_name_key" ON "MembershipPlan"("name");

-- CreateIndex
CREATE INDEX "GymTiming_dayOfWeek_startTime_idx" ON "GymTiming"("dayOfWeek", "startTime");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");
