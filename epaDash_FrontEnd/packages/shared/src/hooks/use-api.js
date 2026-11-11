import { useState, useCallback, useEffect } from "react";
function useApi(apiFunction, options = {}) {
  const { immediate = false, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const execute = useCallback(
    async (...args) => {
      setStatus("loading");
      setError(null);
      try {
        const response = await apiFunction(...args);
        setData(response.data);
        setStatus("success");
        if (onSuccess) onSuccess(response.data);
        return response.data;
      } catch (err) {
        const apiErr = err;
        setError(apiErr);
        setStatus("error");
        if (onError) onError(apiErr);
        return null;
      }
    },
    [apiFunction, onSuccess, onError]
  );
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
  }, []);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  return {
    data,
    error,
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    execute,
    reset,
    setData
  };
}
export {
  useApi
};
