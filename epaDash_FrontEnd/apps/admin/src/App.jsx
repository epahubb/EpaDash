import { AuthProvider, NotificationContainer } from "@epadash/shared";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
function App() {
  return <AuthProvider>
    <RouterProvider router={router} />
    <NotificationContainer />
  </AuthProvider>;
}
export {
  App as default
};
