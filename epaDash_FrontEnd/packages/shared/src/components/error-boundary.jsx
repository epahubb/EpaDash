import { Component } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "./index";
class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null
  };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in UI component tree:", error, errorInfo);
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6"><div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-5"><AlertOctagon className="h-8 w-8" /></div><h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2><p className="text-sm text-gray-600 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this view. You can reload the page or return to safety.
            </p>{this.state.error && <div className="mb-6 p-3 bg-gray-100 rounded-lg text-left overflow-x-auto"><p className="text-xs font-mono text-red-600 break-words">{this.state.error.message}</p></div>}<div className="flex justify-center gap-3"><Button
        variant="primary"
        onClick={this.handleReset}
        leftIcon={<RotateCcw className="h-4 w-4" />}
      >
                Reload Page
              </Button></div></div></div>;
    }
    return this.props.children;
  }
}
export {
  ErrorBoundary
};
