import { ApiService } from "./service";
import { API_ENDPOINTS } from "./endpoints";
class TestBackendService {
  /**
   * Pings the test backend health check endpoint
   */
  static async checkHealth() {
    return ApiService.get(API_ENDPOINTS.HEALTH);
  }
  /**
   * Sends an echo request to test end-to-end communication
   */
  static async testEcho(payload) {
    return ApiService.post(API_ENDPOINTS.TEST.ECHO, payload);
  }
  /**
   * Tests protected endpoint communication with authorization token
   */
  static async testProtected() {
    return ApiService.get(API_ENDPOINTS.TEST.PROTECTED);
  }
  /**
   * Tests error handling by requesting an intentional backend error
   */
  static async testErrorSimulation(statusCode = 422) {
    return ApiService.get(`${API_ENDPOINTS.TEST.ERROR}?status=${statusCode}`);
  }
}
export {
  TestBackendService
};
