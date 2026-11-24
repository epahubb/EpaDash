import { PrismaClient, Role, MerchantStatus, ProductStatus, OrderStatus, PaymentProvider, PaymentStatus, DeliveryStatus } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEVELOPMENT_SEED !== "true") {
    throw new Error("Development seed blocked. Set ALLOW_DEVELOPMENT_SEED=true only for a local/test database.");
  }
  const password = process.env.SEED_DEMO_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("Set SEED_DEMO_PASSWORD to a local-only password of at least 12 characters.");
  }
  const passwordHash = await argon2.hash(password);

  const demoUsers = [
    { email: "customer.demo@epadash.local", firstName: "Demo", lastName: "Customer", role: Role.CUSTOMER },
    { email: "merchant.demo@epadash.local", firstName: "Demo", lastName: "Merchant", role: Role.MERCHANT },
    { email: "rider.demo@epadash.local", firstName: "Demo", lastName: "Rider", role: Role.RIDER },
    { email: "admin.demo@epadash.local", firstName: "Demo", lastName: "Admin", role: Role.ADMIN }
  ];
  const users = new Map<Role, { id: string }>();
  for (const item of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: { passwordHash, status: "ACTIVE" },
      create: {
        email: item.email, passwordHash, firstName: item.firstName, lastName: item.lastName,
        status: "ACTIVE", emailVerifiedAt: new Date(), roles: { create: { role: item.role } }
      }
    });
    await prisma.userRole.upsert({
      where: { userId_role: { userId: user.id, role: item.role } },
      update: {}, create: { userId: user.id, role: item.role }
    });
    users.set(item.role, user);
  }

  const customer = users.get(Role.CUSTOMER)!;
  const merchantOwner = users.get(Role.MERCHANT)!;
  const riderUser = users.get(Role.RIDER)!;

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customer.id }, update: {},
    create: { userId: customer.id, displayName: "Demo Customer" }
  });
  const rider = await prisma.riderProfile.upsert({
    where: { userId: riderUser.id }, update: { verificationStatus: "VERIFIED", isAvailable: true },
    create: { userId: riderUser.id, verificationStatus: "VERIFIED", isAvailable: true, vehicleType: "BICYCLE" }
  });

  const merchant = await prisma.merchant.upsert({
    where: { slug: "demo-market" }, update: { status: MerchantStatus.ACTIVE, isPublic: true, acceptsOrders: true },
    create: {
      ownerUserId: merchantOwner.id, name: "Demo Market", slug: "demo-market",
      city: "Accra", region: "Greater Accra", status: MerchantStatus.ACTIVE,
      isPublic: true, acceptsOrders: true
    }
  });
  const merchantCategory = await prisma.merchantCategory.upsert({
    where: { slug: "grocery" }, update: {}, create: { name: "Grocery", slug: "grocery" }
  });
  await prisma.merchantCategoryLink.upsert({
    where: { merchantId_categoryId: { merchantId: merchant.id, categoryId: merchantCategory.id } },
    update: {}, create: { merchantId: merchant.id, categoryId: merchantCategory.id }
  });

  const productCategory = await prisma.productCategory.upsert({
    where: { slug: "pantry" }, update: {}, create: { name: "Pantry", slug: "pantry" }
  });
  const product = await prisma.product.upsert({
    where: { merchantId_slug: { merchantId: merchant.id, slug: "demo-rice" } },
    update: { status: ProductStatus.PUBLISHED, isAvailable: true },
    create: {
      merchantId: merchant.id, name: "Demo Rice", slug: "demo-rice", sku: "DEMO-RICE-001",
      unitPrice: "35.00", status: ProductStatus.PUBLISHED, isAvailable: true,
      categories: { create: { categoryId: productCategory.id } },
      inventory: { create: { quantityOnHand: 50, quantityReserved: 0, lowStockLevel: 5 } }
    }
  });
  const address = await prisma.address.upsert({
    where: { id: "00000000-0000-4000-8000-000000000101" },
    update: {},
    create: {
      id: "00000000-0000-4000-8000-000000000101", userId: customer.id,
      recipientName: "Demo Customer", phone: "+233200000000",
      addressLine1: "Demo Street 1", city: "Accra", region: "Greater Accra",
      countryCode: "GH", isDefault: true
    }
  });

  const order = await prisma.order.upsert({
    where: { orderNumber: "EPD-DEMO-0001" },
    update: {},
    create: {
      orderNumber: "EPD-DEMO-0001", customerId: customerProfile.id, merchantId: merchant.id,
      deliveryAddressId: address.id, deliveryRecipientName: address.recipientName,
      deliveryPhone: address.phone, deliveryAddressLine1: address.addressLine1,
      deliveryAddressLine2: address.addressLine2, deliveryCity: address.city,
      deliveryRegion: address.region, deliveryCountryCode: address.countryCode,
      status: OrderStatus.PAID, currency: "GHS", subtotal: "35.00",
      deliveryFee: "5.00", discountTotal: "0.00", grandTotal: "40.00",
      items: { create: { productId: product.id, productName: product.name, skuSnapshot: product.sku, quantity: 1, unitPrice: "35.00", lineTotal: "35.00" } },
      statusHistory: { create: { toStatus: OrderStatus.PAID, reason: "Development seed" } }
    }
  });
  await prisma.payment.upsert({
    where: { idempotencyKey: "seed-payment-epadash-demo-0001" },
    update: {},
    create: {
      orderId: order.id, provider: PaymentProvider.MANUAL, amount: "40.00",
      currency: "GHS", status: PaymentStatus.SUCCEEDED,
      idempotencyKey: "seed-payment-epadash-demo-0001", confirmedAt: new Date()
    }
  });
  const delivery = await prisma.delivery.upsert({
    where: { orderId: order.id }, update: {},
    create: { orderId: order.id, riderId: rider.id, status: DeliveryStatus.ASSIGNED, assignedAt: new Date() }
  });
  const activeAssignment = await prisma.deliveryAssignment.findFirst({
    where: { deliveryId: delivery.id, status: "ACTIVE" }
  });
  if (!activeAssignment) {
    await prisma.deliveryAssignment.create({
      data: { deliveryId: delivery.id, riderId: rider.id, status: "ACTIVE", assignedAt: new Date(), reason: "Development seed assignment" }
    });
  }
  console.log("EpaDash development seed completed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
