import { useNotificationStore } from "../stores";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../utils";
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();
  if (!notifications.length) return null;
  return <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">{notifications.map((toast) => {
    const icons = {
      success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
      error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
      info: <Info className="h-5 w-5 text-blue-500 shrink-0" />
    };
    const borders = {
      success: "border-emerald-200 bg-white text-gray-900",
      error: "border-red-200 bg-white text-gray-900",
      warning: "border-amber-200 bg-white text-gray-900",
      info: "border-blue-200 bg-white text-gray-900"
    };
    return <div
      key={toast.id}
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-4",
        borders[toast.type]
      )}
    >{icons[toast.type]}<div className="flex-1 min-w-0"><h4 className="text-sm font-semibold text-gray-900 leading-snug">{toast.title}</h4>{toast.message && <p className="mt-1 text-xs text-gray-600 leading-relaxed">{toast.message}</p>}</div><button
      onClick={() => removeNotification(toast.id)}
      className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg hover:bg-gray-100"
      aria-label="Close notification"
    ><X className="h-4 w-4" /></button></div>;
  })}</div>;
};
export {
  NotificationContainer
};
