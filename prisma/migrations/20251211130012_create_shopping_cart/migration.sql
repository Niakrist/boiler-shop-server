-- CreateTable
CREATE TABLE "shoppingCart" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "boiler_manufacturer" TEXT NOT NULL,
    "parts_manufacturer" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "in_stock" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "part_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,

    CONSTRAINT "shoppingCart_pkey" PRIMARY KEY ("id")
);
