import { Loader2 } from "lucide-react";
const FullPageLoader = ({
  message = "Loading EpaDash..."
}) => {
  return <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"><div className="flex flex-col items-center gap-4"><div className="relative"><div className="h-12 w-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" /><Loader2 className="h-6 w-6 text-emerald-600 absolute inset-0 m-auto animate-pulse" /></div><p className="text-sm font-medium text-gray-700 tracking-wide">{message}</p></div></div>;
};
export {
  FullPageLoader
};
