import "./App.css";
import FileDrop from "./components/FileDrop/FileDrop";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Bundle File Upload App
            </h1>
            <p className="text-gray-600 mt-2">
              Upload files below and track their processing status
            </p>
          </header>
          <div className="bg-white shadow-md rounded-lg p-6">
            <FileDrop />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">Task List</div>
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
