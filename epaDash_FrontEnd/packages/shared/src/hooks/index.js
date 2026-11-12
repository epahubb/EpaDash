export * from "./use-api";
export * from "./use-pagination";
export * from "./use-debounce";
export * from "./use-local-storage";
export * from "./use-responsive";
export * from "./use-notification";
import { useState, useCallback } from "react";
function useForm(options) {
  const { initialValues, onSubmit, validate } = options;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const newValue = type === "checkbox" ? e.target.checked : value;
      setValues((prev) => ({ ...prev, [name]: newValue }));
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors]
  );
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);
  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setErrors,
    reset,
    setValues
  };
}
export {
  useForm
};
