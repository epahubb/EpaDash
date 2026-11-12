/**
 * EpaDash Shared Type Definitions
 *
 * Since the project uses JavaScript (not TypeScript), these are JSDoc
 * typedef declarations that power IDE intellisense and serve as the
 * single source of truth for domain object shapes across all apps.
 *
 * @module types
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {'admin'|'merchant'|'rider'|'customer'} role
 * @property {'active'|'inactive'|'suspended'} status
 * @property {string|null} avatarUrl
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresAt - unix timestamp in ms
 */

// ─── Merchant ─────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Merchant
 * @property {string} id
 * @property {string} userId
 * @property {string} businessName
 * @property {string} description
 * @property {string} category
 * @property {string} address
 * @property {string|null} logoUrl
 * @property {string|null} coverUrl
 * @property {'active'|'inactive'|'pending_verification'|'suspended'} status
 * @property {boolean} isOpen
 * @property {number} averageRating
 * @property {number} totalReviews
 * @property {number} deliveryFee
 * @property {number} minOrderAmount
 * @property {string} estimatedDeliveryTime
 * @property {string} createdAt
 */

// ─── Menu ─────────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} merchantId
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {string|null} imageUrl
 * @property {boolean} isAvailable
 * @property {number|null} prepTimeMinutes
 * @property {string[]} tags
 * @property {string} createdAt
 */

// ─── Order ────────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} OrderItem
 * @property {string} menuItemId
 * @property {string} name
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} subtotal
 * @property {string|null} notes
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customerId
 * @property {string} merchantId
 * @property {string|null} riderId
 * @property {OrderItem[]} items
 * @property {number} subtotal
 * @property {number} deliveryFee
 * @property {number} total
 * @property {'pending'|'confirmed'|'preparing'|'ready_for_pickup'|'out_for_delivery'|'delivered'|'cancelled'|'rejected'} status
 * @property {'mobile_money'|'cash_on_delivery'|'card'} paymentMethod
 * @property {'pending'|'paid'|'failed'|'refunded'} paymentStatus
 * @property {string} deliveryAddress
 * @property {string} customerPhone
 * @property {string|null} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

// ─── Rider ────────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Rider
 * @property {string} id
 * @property {string} userId
 * @property {string} vehicleType
 * @property {string} vehiclePlate
 * @property {'online'|'offline'|'busy'} onlineStatus
 * @property {'active'|'inactive'|'suspended'|'pending_verification'} status
 * @property {number} averageRating
 * @property {number} totalDeliveries
 * @property {number} totalEarnings
 * @property {string|null} currentLocation
 * @property {string} createdAt
 */

// ─── Delivery ─────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Delivery
 * @property {string} id
 * @property {string} orderId
 * @property {string} riderId
 * @property {'assigned'|'picked_up'|'in_transit'|'delivered'|'failed'} status
 * @property {string|null} pickedUpAt
 * @property {string|null} deliveredAt
 * @property {number|null} distance
 * @property {number} fee
 */

// ─── Review ───────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} orderId
 * @property {string} customerId
 * @property {string} merchantId
 * @property {number} rating  - 1-5
 * @property {string|null} comment
 * @property {string} createdAt
 */

// ─── API Responses ────────────────────────────────────────────────────────────
/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {T} data
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {string} message
 * @property {Record<string, string>|undefined} errors
 * @property {string|undefined} code
 */

// ─── UI / Store ───────────────────────────────────────────────────────────────
/**
 * @typedef {'success'|'error'|'warning'|'info'} NotificationType
 *
 * @typedef {Object} Notification
 * @property {string} id
 * @property {NotificationType} type
 * @property {string} title
 * @property {string|undefined} message
 * @property {number|undefined} duration  - ms, 0 = persistent
 */

/**
 * @typedef {Object} SidebarItem
 * @property {string} label
 * @property {string} path
 * @property {React.ComponentType} icon
 * @property {number|string|undefined} badge
 * @property {SidebarItem[]|undefined} children
 */

// Export role constants for runtime use
const USER_ROLES = /** @type {const} */ ({
  ADMIN: "admin",
  MERCHANT: "merchant",
  RIDER: "rider",
  CUSTOMER: "customer",
});

const ORDER_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY_FOR_PICKUP: "ready_for_pickup",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
});

const PAYMENT_METHODS = /** @type {const} */ ({
  MOBILE_MONEY: "mobile_money",
  CASH_ON_DELIVERY: "cash_on_delivery",
  CARD: "card",
});

const PAYMENT_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
});

const RIDER_STATUSES = /** @type {const} */ ({
  ONLINE: "online",
  OFFLINE: "offline",
  BUSY: "busy",
});

export {
  USER_ROLES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  RIDER_STATUSES,
};

