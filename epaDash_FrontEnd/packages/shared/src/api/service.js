import { apiClient, normalizeApiError } from "./client";
class ApiService {
  /**
   * HTTP GET Request
   */
  static async get(url, config) {
    try {
      const response = await apiClient.get(url, config);
      return this.standardizeResponse(response.data);
    } catch (error) {
      throw normalizeApiError(error);
    }
  }
  /**
   * HTTP POST Request
   */
  static async post(url, data, config) {
    try {
      const response = await apiClient.post(url, data, config);
      return this.standardizeResponse(response.data);
    } catch (error) {
      throw normalizeApiError(error);
    }
  }
  /**
   * HTTP PUT Request
   */
  static async put(url, data, config) {
    try {
      const response = await apiClient.put(url, data, config);
      return this.standardizeResponse(response.data);
    } catch (error) {
      throw normalizeApiError(error);
    }
  }
  /**
   * HTTP PATCH Request
   */
  static async patch(url, data, config) {
    try {
      const response = await apiClient.patch(url, data, config);
      return this.standardizeResponse(response.data);
    } catch (error) {
      throw normalizeApiError(error);
    }
  }
  /**
   * HTTP DELETE Request
   */
  static async delete(url, config) {
    try {
      const response = await apiClient.delete(url, config);
      return this.standardizeResponse(response.data);
    } catch (error) {
      throw normalizeApiError(error);
    }
  }
  /**
   * Ensures response follows consistent ApiResponse<T> envelope
   */
  static standardizeResponse(raw) {
    if (raw && typeof raw === "object" && "success" in raw && "data" in raw) {
      return raw;
    }
    return {
      success: true,
      message: "Operation successful",
      data: raw
    };
  }
}
export {
  ApiService
};
