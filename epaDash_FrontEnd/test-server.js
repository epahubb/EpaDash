/**
 * EpaDash Full Test Backend Server
 * Comprehensive in-memory REST API with state persistence across Customer,
 * Rider, Merchant, and Admin applications.
 * Port: 8000
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// In-Memory Data Store
const db = {
  merchants: [
    {
      id: 'm1',
      name: 'Buka Restaurant Osu',
      category: 'Ghanaian & Local Specialities',
      rating: 4.8,
      reviewsCount: 320,
      deliveryTime: '20-35 mins',
      deliveryFee: 12.0,
      address: '10th Street, Osu RE, Accra',
      phone: '+233 24 488 9900',
      isOpen: true,
      image: '/images/delicious.jpg',
      bannerImage: '/images/delicious.jpg',
      menu: [
        { id: 'item_1', name: 'Signature Assorted Meat Jollof', price: 65.0, category: 'Jollof & Rice', isAvailable: true, prepTime: '15-20 min', imageUrl: '/images/jollof.webp' },
        { id: 'item_2', name: 'Banku with Fresh Tilapia & Hot Pepper', price: 75.0, category: 'Swallows & Soups', isAvailable: true, prepTime: '20-25 min', imageUrl: '/images/banku.webp' },
        { id: 'item_3', name: 'Special Assorted Fried Rice Platter', price: 60.0, category: 'Jollof & Rice', isAvailable: true, prepTime: '15 min', imageUrl: '/images/firedrice.webp' },
        { id: 'item_4', name: 'Spicy Peppered Gizzard Skewers', price: 45.0, category: 'Sides & Grills', isAvailable: true, prepTime: '15 min', imageUrl: '/images/zizard.webp' },
        { id: 'item_5', name: 'Chilled Hibiscus Sobolo (500ml)', price: 18.0, category: 'Drinks', isAvailable: true, prepTime: '5 min', imageUrl: '/images/bels.jpg' },
      ],
    },
    {
      id: 'm2',
      name: 'Starbites Food Bar',
      category: 'Continental & Burgers',
      rating: 4.7,
      reviewsCount: 512,
      deliveryTime: '25-40 mins',
      deliveryFee: 15.0,
      address: 'Airport Residential Area, Accra',
      phone: '+233 20 888 7766',
      isOpen: true,
      image: '/images/cheese.webp',
      bannerImage: '/images/cheese.webp',
      menu: [
        { id: 'item_6', name: 'Loaded Beef Burger & Fries', price: 70.0, category: 'Burgers', isAvailable: true, prepTime: '20 min', imageUrl: '/images/cheese.webp' },
        { id: 'item_7', name: 'Crispy Wings (8 pcs)', price: 60.0, category: 'Grills', isAvailable: true, prepTime: '15 min', imageUrl: '/images/fried.webp' },
        { id: 'item_9', name: 'Flaky Golden Beef Meat Pie (2 pcs)', price: 24.0, category: 'Sides & Grills', isAvailable: true, prepTime: '5 min', imageUrl: '/images/pie.webp' },
      ],
    },
    {
      id: 'm3',
      name: 'Mama Lit Kitchen',
      category: 'Local Soups & Banku',
      rating: 4.9,
      reviewsCount: 184,
      deliveryTime: '30-45 mins',
      deliveryFee: 10.0,
      address: 'Labone, Accra',
      phone: '+233 24 555 1234',
      isOpen: true,
      image: '/images/banku.webp',
      bannerImage: '/images/banku.webp',
      menu: [
        { id: 'item_8', name: 'Banku with Groundnut Soup & Goat Meat', price: 65.0, category: 'Swallows & Soups', isAvailable: true, prepTime: '25 min', imageUrl: '/images/bank2.webp' },
        { id: 'item_10', name: 'Silky Fufu with Light Soup & Goat Meat', price: 70.0, category: 'Swallows & Soups', isAvailable: true, prepTime: '25 min', imageUrl: '/images/fufu.jpg' },
        { id: 'item_11', name: 'Pounded Fufu with Rich Groundnut Soup', price: 68.0, category: 'Swallows & Soups', isAvailable: true, prepTime: '25 min', imageUrl: '/images/fufu-3.webp' },
      ],
    },
  ],

  riders: [
    {
      id: 'rd_01',
      name: 'Kofi Annan',
      phone: '+233 24 411 2233',
      vehicle: 'Motorcycle (Yamaha 125)',
      status: 'online',
      rating: 4.92,
      completedTrips: 420,
      currentLocation: 'Osu, Accra',
      todayEarnings: 185.5,
    },
    {
      id: 'rd_02',
      name: 'Yaw Boateng',
      phone: '+233 20 123 9988',
      vehicle: 'Motorcycle (Bajaj Boxer)',
      status: 'offline',
      rating: 4.75,
      completedTrips: 310,
      currentLocation: 'Airport, Accra',
      todayEarnings: 120.0,
    },
  ],

  orders: [
    {
      id: 'ORD-8492',
      customerName: 'Kwame Mensah',
      customerPhone: '024 123 4567',
      merchantId: 'm1',
      merchantName: 'Buka Restaurant Osu',
      merchantAddress: '10th Street, Osu RE, Accra',
      riderId: 'rd_01',
      riderName: 'Kofi Annan',
      riderPhone: '+233 24 411 2233',
      items: [
        { id: 'item_1', name: 'Signature Assorted Meat Jollof', quantity: 2, price: 65.0, imageUrl: '/images/jollof.webp' },
        { id: 'item_5', name: 'Chilled Hibiscus Sobolo (500ml)', quantity: 1, price: 17.0, imageUrl: '/images/bels.jpg' },
      ],
      dishImage: '/images/jollof.webp',
      subtotal: 147.0,
      deliveryFee: 12.0,
      serviceFee: 5.0,
      total: 164.0,
      status: 'preparing',
      deliveryAddress: 'Plot 42, Ring Road Central, Kokomlemle, Accra',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      estimatedDelivery: '18 mins',
    },
    {
      id: 'ORD-8488',
      customerName: 'Sarah Danquah',
      customerPhone: '020 987 6543',
      merchantId: 'm1',
      merchantName: 'Buka Restaurant Osu',
      merchantAddress: '10th Street, Osu RE, Accra',
      items: [
        { id: 'item_2', name: 'Banku with Fresh Tilapia & Hot Pepper', quantity: 1, price: 75.0, imageUrl: '/images/banku.webp' },
      ],
      dishImage: '/images/banku.webp',
      subtotal: 75.0,
      deliveryFee: 12.0,
      serviceFee: 3.75,
      total: 90.75,
      status: 'ready',
      deliveryAddress: 'Cantonments, Accra',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      estimatedDelivery: '25 mins',
    },
  ],

  availableDeliveries: [
    {
      id: 'del_req_101',
      orderId: 'ORD-8492',
      orderNumber: 'ORD-8492',
      merchantName: 'Buka Restaurant Osu',
      pickupAddress: '10th Street, Osu RE, Accra',
      dropoffAddress: 'Plot 42, Ring Road Central, Kokomlemle',
      estimatedEarnings: 24.5,
      distanceKm: 4.8,
      estMinutes: 22,
      itemsSummary: '2x Assorted Jollof, 1x Sobolo',
      dishImage: '/images/jollof.webp',
    },
    {
      id: 'del_req_102',
      orderId: 'ORD-8488',
      orderNumber: 'ORD-8488',
      merchantName: 'Buka Restaurant Osu',
      pickupAddress: '10th Street, Osu RE, Accra',
      dropoffAddress: 'Cantonments, Accra',
      estimatedEarnings: 19.0,
      distanceKm: 3.2,
      estMinutes: 16,
      itemsSummary: '1x Banku with Fresh Tilapia',
      dishImage: '/images/banku.webp',
    },
  ],
};

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Client, Accept',
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:8000'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Static Image Serving for /images/*
  if (pathname.startsWith('/images/')) {
    const imageName = path.basename(pathname);
    const imagePath = path.join(__dirname, 'apps', 'customer', 'public', 'images', imageName);
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(imageName).toLowerCase();
      const contentType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      });
      return fs.createReadStream(imagePath).pipe(res);
    }
  }

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Client, Accept',
    });
    res.end();
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        parsedBody = { raw: body };
      }
    }

    /* ──────────────── Health & Diagnostics ──────────────── */
    if (pathname === '/api/v1/health' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'EpaDash Backend Service is online and operational.',
        data: {
          status: 'online',
          uptime: process.uptime(),
          version: '1.0.0-beta',
          timestamp: new Date().toISOString(),
          environment: 'development-test',
        },
      });
    }

    if (pathname === '/api/v1/test/echo' && method === 'POST') {
      return sendJson(res, 200, {
        success: true,
        message: 'Echo verified successfully through EpaDash centralized API service.',
        data: {
          timestamp: new Date().toISOString(),
          echo: parsedBody,
          serverTime: Date.now(),
          status: 'online',
          headersReceived: {
            authorization: req.headers['authorization'] || 'none',
            client: req.headers['x-request-client'] || 'none',
          },
        },
      });
    }

    if (pathname === '/api/v1/test/protected' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendJson(res, 401, {
          success: false,
          message: 'Unauthorized: Missing or invalid Bearer token',
          code: 'AUTH_REQUIRED',
        });
      }
      return sendJson(res, 200, {
        success: true,
        message: 'Token verified successfully.',
        data: {
          authorized: true,
          tokenPreview: authHeader.substring(0, 20) + '...',
          user: { id: 'usr_verified_test', email: 'test@epadash.com', role: 'admin' },
        },
      });
    }

    if (pathname === '/api/v1/test/error') {
      const requestedStatus = parseInt(parsedUrl.searchParams.get('status') || '422', 10);
      return sendJson(res, requestedStatus, {
        success: false,
        message: `Simulated server error response (${requestedStatus})`,
        errors: { field_name: ['This is a simulated validation failure from the backend.'] },
        code: 'SIMULATED_TEST_ERROR',
      });
    }

    /* ──────────────── Authentication ──────────────── */
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const { email } = parsedBody;
      return sendJson(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'usr_live_01',
            email: email || 'user@epadash.com',
            name: 'Verified User',
            role: email && email.includes('admin') ? 'admin' : email && email.includes('rider') ? 'rider' : email && email.includes('restaurant') ? 'merchant' : 'customer',
          },
          tokens: {
            accessToken: `epadash_live_acc_${Date.now()}`,
            refreshToken: `epadash_live_ref_${Date.now()}`,
            expiresAt: Date.now() + 3600 * 1000,
          },
        },
      });
    }

    if (pathname === '/api/v1/auth/refresh' && method === 'POST') {
      return sendJson(res, 200, {
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: `epadash_refreshed_acc_${Date.now()}`,
          refreshToken: `epadash_refreshed_ref_${Date.now()}`,
          expiresAt: Date.now() + 3600 * 1000,
        },
      });
    }

    /* ──────────────── Orders CRUD ──────────────── */
    if (pathname === '/api/v1/orders' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Orders retrieved',
        data: db.orders,
      });
    }

    if (pathname === '/api/v1/orders' && method === 'POST') {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        items: parsedBody.items || [],
        subtotal: parsedBody.subtotal || 0,
        deliveryFee: parsedBody.deliveryFee || 10.0,
        serviceFee: parsedBody.serviceFee || 5.0,
        total: parsedBody.total || 0,
        deliveryAddress: parsedBody.deliveryAddress || 'Accra, Ghana',
        customerName: parsedBody.customerName || 'Customer',
        customerPhone: parsedBody.customerPhone || '024 123 4567',
        merchantName: parsedBody.merchantName || 'Buka Restaurant Osu',
      };
      db.orders.unshift(newOrder);

      // Add to available rider runs
      db.availableDeliveries.unshift({
        id: `del_req_${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.id,
        merchantName: newOrder.merchantName,
        pickupAddress: 'Osu, Accra',
        dropoffAddress: newOrder.deliveryAddress,
        estimatedEarnings: Math.round(newOrder.deliveryFee * 1.8),
        distanceKm: 4.5,
        estMinutes: 20,
        itemsSummary: `${newOrder.items.length} items ordered`,
      });

      return sendJson(res, 201, {
        success: true,
        message: 'Order created successfully',
        data: newOrder,
      });
    }

    // Specific order detail & status update
    if (pathname.startsWith('/api/v1/orders/')) {
      const parts = pathname.split('/');
      const orderId = parts[4];
      const subAction = parts[5];

      const order = db.orders.find((o) => o.id === orderId);
      if (!order) {
        return sendJson(res, 404, { success: false, message: 'Order not found' });
      }

      if (subAction === 'status' && (method === 'PATCH' || method === 'PUT')) {
        order.status = parsedBody.status || order.status;
        return sendJson(res, 200, {
          success: true,
          message: `Order status updated to ${order.status}`,
          data: order,
        });
      }

      if (method === 'GET') {
        return sendJson(res, 200, { success: true, message: 'Order found', data: order });
      }
    }

    /* ──────────────── Merchants CRUD ──────────────── */
    if (pathname === '/api/v1/merchants' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Merchants retrieved',
        data: db.merchants,
      });
    }

    if (pathname.startsWith('/api/v1/merchants/')) {
      const merchantId = pathname.split('/')[4];
      const merchant = db.merchants.find((m) => m.id === merchantId);
      if (!merchant) {
        return sendJson(res, 404, { success: false, message: 'Merchant not found' });
      }
      return sendJson(res, 200, { success: true, message: 'Merchant details', data: merchant });
    }

    /* ──────────────── Riders & Dispatch ──────────────── */
    if (pathname === '/api/v1/riders' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Riders retrieved',
        data: db.riders,
      });
    }

    if (pathname === '/api/v1/riders/deliveries/available' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Available deliveries retrieved',
        data: db.availableDeliveries,
      });
    }

    if (pathname.startsWith('/api/v1/riders/deliveries/') && pathname.endsWith('/accept') && method === 'POST') {
      const delId = pathname.split('/')[5];
      const trip = db.availableDeliveries.find((d) => d.id === delId);
      db.availableDeliveries = db.availableDeliveries.filter((d) => d.id !== delId);
      return sendJson(res, 200, {
        success: true,
        message: 'Delivery run accepted by rider',
        data: trip || { id: delId, status: 'accepted' },
      });
    }

    /* ──────────────── Admin Metrics ──────────────── */
    if (pathname === '/api/v1/admin/metrics' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Platform metrics calculated',
        data: {
          totalUsers: 12847,
          totalMerchants: db.merchants.length,
          activeRiders: db.riders.filter((r) => r.status === 'online').length,
          totalOrders: db.orders.length,
          todayRevenue: 48750.0,
        },
      });
    }

    // Fallback 404
    sendJson(res, 404, {
      success: false,
      message: `Endpoint ${method} ${pathname} not found on EpaDash backend`,
    });
  });
});

server.listen(PORT, () => {
  console.log(`[EpaDash Test Backend] Listening on http://localhost:${PORT}`);
});

module.exports = server;
