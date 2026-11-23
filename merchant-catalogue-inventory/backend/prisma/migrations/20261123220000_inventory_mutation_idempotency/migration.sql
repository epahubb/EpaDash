CREATE TABLE "InventoryMutation" (
    "inventoryId" UUID NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "fingerprint" CHAR(64) NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMutation_pkey" PRIMARY KEY ("inventoryId", "key")
);

ALTER TABLE "InventoryMutation" ADD CONSTRAINT "InventoryMutation_inventoryId_fkey"
    FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
