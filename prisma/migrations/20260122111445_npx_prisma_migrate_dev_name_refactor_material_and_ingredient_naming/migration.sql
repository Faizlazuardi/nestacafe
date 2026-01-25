/*
  Warnings:

  - You are about to drop the column `quantity` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the `ProductMaterial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stock` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaterialUnit" AS ENUM ('GRAM', 'ML');

-- DropForeignKey
ALTER TABLE "ProductMaterial" DROP CONSTRAINT "ProductMaterial_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ProductMaterial" DROP CONSTRAINT "ProductMaterial_productId_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "quantity",
DROP COLUMN "type",
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "unit" "MaterialUnit" NOT NULL;

-- DropTable
DROP TABLE "ProductMaterial";

-- DropEnum
DROP TYPE "MaterialType";

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" BIGSERIAL NOT NULL,
    "productId" BIGINT NOT NULL,
    "materialId" BIGINT NOT NULL,
    "quantityUsed" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_productId_materialId_key" ON "ProductIngredient"("productId", "materialId");

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
