const http = require('http');
const server = require('../test-server');

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function runTests() {
  console.log('───────────────────────────────────────────────────────');
  console.log('🚀 Running EpaDash Centralised API Communication Tests');
  console.log('───────────────────────────────────────────────────────\n');

  try {
    // 1. Health check test
    console.log('1. Testing Public Health Check Endpoint (GET /api/v1/health)...');
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/health',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Request-Client': 'EpaDash-Verifier',
      },
    });

    if (healthRes.status === 200 && healthRes.body.success) {
      console.log('   ✅ Health check passed! Status:', healthRes.body.data.status);
      console.log('   Response message:', healthRes.body.message);
    } else {
      throw new Error(`Health check failed with status ${healthRes.status}`);
    }

    // 2. Echo communication test
    console.log('\n2. Testing Centralised API Payload Round-trip (POST /api/v1/test/echo)...');
    const payload = {
      testSession: 'Verification-2026',
      appsTested: ['customer', 'rider', 'merchant', 'admin'],
      timestamp: Date.now(),
    };
    const echoRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 8000,
        path: '/api/v1/test/echo',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Request-Client': 'EpaDash-Verifier',
        },
      },
      payload
    );

    if (echoRes.status === 200 && echoRes.body.success) {
      console.log('   ✅ Echo request passed! Server acknowledged payload.');
      console.log('   Client header received by server:', echoRes.body.data.headersReceived.client);
    } else {
      throw new Error(`Echo request failed with status ${echoRes.status}`);
    }

    // 3. Protected endpoint with Bearer Token
    console.log('\n3. Testing Protected Endpoint with Authorization Token (GET /api/v1/test/protected)...');
    const token = 'epadash_secure_access_token_demo_98765';
    const protectedRes = await makeRequest({
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/test/protected',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Request-Client': 'EpaDash-Verifier',
      },
    });

    if (protectedRes.status === 200 && protectedRes.body.data.authorized) {
      console.log('   ✅ Protected endpoint passed! Authorization header accepted.');
      console.log('   Verified user role:', protectedRes.body.data.user.role);
    } else {
      throw new Error(`Protected request failed with status ${protectedRes.status}`);
    }

    // 4. Standardized Error Handling
    console.log('\n4. Testing Standardized Error Handling (GET /api/v1/test/error?status=422)...');
    const errorRes = await makeRequest({
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/test/error?status=422',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (errorRes.status === 422 && errorRes.body.code === 'SIMULATED_TEST_ERROR') {
      console.log('   ✅ Standardized error response verified! Status 422 with validation errors map.');
      console.log('   Error message:', errorRes.body.message);
    } else {
      throw new Error(`Error test failed with status ${errorRes.status}`);
    }

    console.log('\n───────────────────────────────────────────────────────');
    console.log('🎉 ALL BACKEND COMMUNICATION ACCEPTANCE CRITERIA PASSED!');
    console.log('───────────────────────────────────────────────────────\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();

