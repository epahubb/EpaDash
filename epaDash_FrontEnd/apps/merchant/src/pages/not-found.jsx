import { Link } from "react-router-dom";
import { Button } from "@epadash/shared";
import { LayoutDashboard } from "lucide-react";
function NotFoundPage() {
  return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"><div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4">
        404
      </div><h2 className="text-xl font-bold text-gray-900 mb-2">Merchant View Not Found</h2><p className="text-sm text-gray-500 max-w-sm mb-6">
        The merchant management page you are attempting to view does not exist.
      </p><Link to="/"><Button variant="primary" size="md" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
          Back to Kitchen Dashboard
        </Button></Link></div>;
}
export {
  NotFoundPage as default
};
