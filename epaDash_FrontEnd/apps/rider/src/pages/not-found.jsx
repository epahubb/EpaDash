import { Link } from "react-router-dom";
import { Button } from "@epadash/shared";
import { Home } from "lucide-react";
function NotFoundPage() {
  return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"><div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4">
        404
      </div><h2 className="text-xl font-bold text-gray-900 mb-2">Delivery Not Found</h2><p className="text-sm text-gray-500 max-w-sm mb-6">
        This delivery run or screen does not exist or has already been assigned.
      </p><Link to="/"><Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
          Back to Dashboard
        </Button></Link></div>;
}
export {
  NotFoundPage as default
};
