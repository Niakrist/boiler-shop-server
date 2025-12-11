-- CreateTable
CREATE TABLE "boilerPart" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prise" INTEGER NOT NULL DEFAULT 0,
    "boiler_manufacturer" TEXT NOT NULL,
    "parts_manufacturer" TEXT NOT NULL,
    "vender_code" TEXT NOT NULL,
    "images" TEXT[],
    "in_stock" INTEGER NOT NULL DEFAULT 0,
    "bestsellers" BOOLEAN NOT NULL DEFAULT false,
    "new" BOOLEAN NOT NULL DEFAULT false,
    "popularity" INTEGER NOT NULL,
    "compatibility" TEXT NOT NULL,

    CONSTRAINT "boilerPart_pkey" PRIMARY KEY ("id")
);
