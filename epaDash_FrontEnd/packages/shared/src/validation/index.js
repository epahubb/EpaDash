import { z } from "zod";
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters")
});
const registerSchema = z.object({
  name: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required").min(10, "Enter a valid phone number (min 10 digits)"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "rider", "merchant", "admin"]).default("customer"),
  businessName: z.string().optional(),
  vehicleType: z.string().optional()
});
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address")
});
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const menuItemSchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  prepTimeMinutes: z.coerce.number().min(1, "Prep time must be at least 1 minute").optional()
});
const orderCheckoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  customerPhone: z.string().min(10, "Phone number is required for delivery contact"),
  paymentMethod: z.enum(["mobile_money", "cash_on_delivery", "card"]),
  notes: z.string().optional()
});
function validateWithZod(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return { success: false, errors };
}
function getFieldError(errors, field) {
  return errors ? errors[field] : void 0;
}
export {
  forgotPasswordSchema,
  getFieldError,
  loginSchema,
  menuItemSchema,
  orderCheckoutSchema,
  registerSchema,
  resetPasswordSchema,
  validateWithZod
};
