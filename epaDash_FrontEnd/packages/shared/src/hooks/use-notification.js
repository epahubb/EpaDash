import { useCallback } from "react";
import { useNotificationStore } from "../stores";

/**
 * useNotification — convenience hook for dispatching toast notifications.
 *
 * const notify = useNotification();
 * notify.success("Order created!");
 * notify.error("Failed to load data", "Check your connection and try again.");
 * notify.info("New update available");
 * notify.warning("Low stock", "Only 2 items remaining.");
 */
function useNotification() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const success = useCallback(
    (title, message, options = {}) =>
      addNotification({ type: "success", title, message, ...options }),
    [addNotification]
  );

  const error = useCallback(
    (title, message, options = {}) =>
      addNotification({ type: "error", title, message, duration: 6000, ...options }),
    [addNotification]
  );

  const warning = useCallback(
    (title, message, options = {}) =>
      addNotification({ type: "warning", title, message, ...options }),
    [addNotification]
  );

  const info = useCallback(
    (title, message, options = {}) =>
      addNotification({ type: "info", title, message, ...options }),
    [addNotification]
  );

  return { success, error, warning, info };
}

export { useNotification };

