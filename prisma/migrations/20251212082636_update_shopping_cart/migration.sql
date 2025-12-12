/*
  Warnings:

  - You are about to drop the `boilerPart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shoppingCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "boilerPart";

-- DropTable
DROP TABLE "shoppingCart";

-- CreateTable
CREATE TABLE "boiler_part" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "boiler_manufacturer" TEXT NOT NULL,
    "parts_manufacturer" TEXT NOT NULL,
    "vender_code" TEXT NOT NULL,
    "images" TEXT[],
    "in_stock" INTEGER NOT NULL DEFAULT 0,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "newBoilerPart" BOOLEAN NOT NULL DEFAULT false,
    "popularity" INTEGER NOT NULL,
    "compatibility" TEXT NOT NULL,

    CONSTRAINT "boiler_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart_item" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cart_id" TEXT NOT NULL,
    "part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_at_addition" INTEGER,

    CONSTRAINT "shopping_cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_user_id_key" ON "shopping_cart"("user_id");

-- CreateIndex
CREATE INDEX "shopping_cart_user_id_idx" ON "shopping_cart"("user_id");

-- CreateIndex
CREATE INDEX "shopping_cart_item_cart_id_idx" ON "shopping_cart_item"("cart_id");

-- CreateIndex
CREATE INDEX "shopping_cart_item_part_id_idx" ON "shopping_cart_item"("part_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_item_cart_id_part_id_key" ON "shopping_cart_item"("cart_id", "part_id");

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_item" ADD CONSTRAINT "shopping_cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "shopping_cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_item" ADD CONSTRAINT "shopping_cart_item_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "boiler_part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
