import { Link } from "react-router-dom";
import { Button } from "@epadash/shared";
import { Home } from "lucide-react";
function NotFoundPage() {
  return <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6"><div className="h-24 w-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-extrabold mb-4">
        404
      </div><h2 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h2><p className="text-sm text-gray-500 max-w-sm mb-6">
        The screen or delivery location you are looking for does not exist or has been moved.
      </p><Link to="/"><Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
          Back to Homepage
        </Button></Link></div>;
}
export {
  NotFoundPage as default
};
