import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const migrationsRoot = join("prisma", "migrations");
if (existsSync(migrationsRoot) && readdirSync(migrationsRoot).some((name) => name !== "migration_lock.toml")) {
  throw new Error("Migration folders already exist. Do not generate another initial migration; create a reviewed incremental migration instead.");
}
const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
const folder = join("prisma", "migrations", `${stamp}_initial_database`);
mkdirSync(folder, { recursive: true });
const prismaArgs = "prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script";
const sql = process.platform === "win32"
  ? execFileSync("cmd.exe", ["/d", "/s", "/c", `npx ${prismaArgs}`], { encoding: "utf8" })
  : execFileSync("npx", ["prisma", "migrate", "diff", "--from-empty", "--to-schema-datamodel", "prisma/schema.prisma", "--script"], { encoding: "utf8" });
const integrity = `
-- Additional PostgreSQL-level integrity rules not expressible in Prisma schema.
ALTER TABLE "Inventory"
  ADD CONSTRAINT "inventory_nonnegative_stock_ck"
  CHECK ("quantityOnHand" >= 0 AND "quantityReserved" >= 0
     AND "quantityReserved" <= "quantityOnHand" AND "lowStockLevel" >= 0);

ALTER TABLE "InventoryMovement"
  ADD CONSTRAINT "inventory_movement_nonzero_ck"
  CHECK ("quantityDelta" <> 0 OR "reservedDelta" <> 0);

ALTER TABLE "Order"
  ADD CONSTRAINT "order_amounts_nonnegative_ck"
  CHECK ("subtotal" >= 0 AND "deliveryFee" >= 0 AND "discountTotal" >= 0 AND "grandTotal" >= 0);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "order_item_quantity_price_ck"
  CHECK ("quantity" > 0 AND "unitPrice" >= 0 AND "lineTotal" >= 0
     AND "lineTotal" = "unitPrice" * "quantity");

ALTER TABLE "Product"
  ADD CONSTRAINT "product_unit_price_nonnegative_ck"
  CHECK ("unitPrice" >= 0);

ALTER TABLE "Order"
  ADD CONSTRAINT "order_currency_format_ck"
  CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "Payment"
  ADD CONSTRAINT "payment_currency_format_ck"
  CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "Refund"
  ADD CONSTRAINT "refund_currency_format_ck"
  CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "Payment"
  ADD CONSTRAINT "payment_amount_positive_ck"
  CHECK ("amount" > 0);

ALTER TABLE "Refund"
  ADD CONSTRAINT "refund_amount_positive_ck"
  CHECK ("amount" > 0);

ALTER TABLE "MerchantOperatingHour"
  ADD CONSTRAINT "merchant_operating_day_ck"
  CHECK ("dayOfWeek" BETWEEN 0 AND 6),
  ADD CONSTRAINT "merchant_operating_time_format_ck"
  CHECK (("opensAt" IS NULL OR "opensAt" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
     AND ("closesAt" IS NULL OR "closesAt" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
     AND ("isClosed" = TRUE OR ("opensAt" IS NOT NULL AND "closesAt" IS NOT NULL)));

ALTER TABLE "Merchant"
  ADD CONSTRAINT "merchant_latitude_range_ck"
  CHECK ("latitude" IS NULL OR ("latitude" BETWEEN -90 AND 90)),
  ADD CONSTRAINT "merchant_longitude_range_ck"
  CHECK ("longitude" IS NULL OR ("longitude" BETWEEN -180 AND 180));

ALTER TABLE "Address"
  ADD CONSTRAINT "address_latitude_range_ck"
  CHECK ("latitude" IS NULL OR ("latitude" BETWEEN -90 AND 90)),
  ADD CONSTRAINT "address_longitude_range_ck"
  CHECK ("longitude" IS NULL OR ("longitude" BETWEEN -180 AND 180));

ALTER TABLE "Order"
  ADD CONSTRAINT "order_delivery_latitude_range_ck"
  CHECK ("deliveryLatitude" IS NULL OR ("deliveryLatitude" BETWEEN -90 AND 90)),
  ADD CONSTRAINT "order_delivery_longitude_range_ck"
  CHECK ("deliveryLongitude" IS NULL OR ("deliveryLongitude" BETWEEN -180 AND 180));

ALTER TABLE "DeliveryTrackingEvent"
  ADD CONSTRAINT "tracking_latitude_range_ck"
  CHECK ("latitude" IS NULL OR ("latitude" BETWEEN -90 AND 90)),
  ADD CONSTRAINT "tracking_longitude_range_ck"
  CHECK ("longitude" IS NULL OR ("longitude" BETWEEN -180 AND 180));

ALTER TABLE "DeliveryAssignment"
  ADD CONSTRAINT "delivery_assignment_time_ck"
  CHECK ("endedAt" IS NULL OR "endedAt" >= "assignedAt"),
  ADD CONSTRAINT "delivery_assignment_active_end_ck"
  CHECK (("status" = 'ACTIVE' AND "endedAt" IS NULL)
      OR ("status" <> 'ACTIVE' AND "endedAt" IS NOT NULL));

-- A delivery can have at most one current rider assignment.
CREATE UNIQUE INDEX "delivery_one_active_assignment_uq"
  ON "DeliveryAssignment" ("deliveryId")
  WHERE "status" = 'ACTIVE';

CREATE OR REPLACE FUNCTION prevent_order_snapshot_mutation()
RETURNS trigger AS $$
BEGIN
  IF OLD."deliveryRecipientName" IS DISTINCT FROM NEW."deliveryRecipientName"
     OR OLD."deliveryPhone" IS DISTINCT FROM NEW."deliveryPhone"
     OR OLD."deliveryAddressLine1" IS DISTINCT FROM NEW."deliveryAddressLine1"
     OR OLD."deliveryAddressLine2" IS DISTINCT FROM NEW."deliveryAddressLine2"
     OR OLD."deliveryCity" IS DISTINCT FROM NEW."deliveryCity"
     OR OLD."deliveryRegion" IS DISTINCT FROM NEW."deliveryRegion"
     OR OLD."deliveryCountryCode" IS DISTINCT FROM NEW."deliveryCountryCode"
     OR OLD."deliveryLatitude" IS DISTINCT FROM NEW."deliveryLatitude"
     OR OLD."deliveryLongitude" IS DISTINCT FROM NEW."deliveryLongitude"
     OR OLD."deliveryNotes" IS DISTINCT FROM NEW."deliveryNotes"
  THEN
    RAISE EXCEPTION 'Order delivery address snapshots are immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "order_delivery_snapshot_immutable_trg"
BEFORE UPDATE ON "Order"
FOR EACH ROW EXECUTE FUNCTION prevent_order_snapshot_mutation();

CREATE OR REPLACE FUNCTION prevent_order_item_snapshot_mutation()
RETURNS trigger AS $$
BEGIN
  IF OLD."productId" IS DISTINCT FROM NEW."productId"
     OR OLD."productName" IS DISTINCT FROM NEW."productName"
     OR OLD."skuSnapshot" IS DISTINCT FROM NEW."skuSnapshot"
     OR OLD."quantity" IS DISTINCT FROM NEW."quantity"
     OR OLD."unitPrice" IS DISTINCT FROM NEW."unitPrice"
     OR OLD."lineTotal" IS DISTINCT FROM NEW."lineTotal"
  THEN
    RAISE EXCEPTION 'Order item purchase snapshots are immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "order_item_snapshot_immutable_trg"
BEFORE UPDATE ON "OrderItem"
FOR EACH ROW EXECUTE FUNCTION prevent_order_item_snapshot_mutation();
`;
writeFileSync(join(folder, "migration.sql"), sql + "\n" + integrity, "utf8");
writeFileSync(join("prisma", "migrations", "migration_lock.toml"), 'provider = "postgresql"\n', "utf8");
console.log(`Generated migration at ${folder}/migration.sql`);
console.log("Review the SQL before applying it. Then run: npx prisma migrate deploy");
