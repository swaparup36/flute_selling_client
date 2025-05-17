-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "name_on" TEXT,
ADD COLUMN     "thread_one" TEXT NOT NULL DEFAULT 'no color',
ADD COLUMN     "thread_two" TEXT NOT NULL DEFAULT 'no color';
