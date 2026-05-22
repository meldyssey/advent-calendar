import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./provider/AuthProvider";
import RootRoute from "./RootRoute";

function App() {
  return (
    <AuthProvider>
      <RootRoute />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
