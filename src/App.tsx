import { Toaster } from "./components/ui/sonner";
import RootRoute from "./RootRoute";

function App() {
  return (
    <div>
      <RootRoute />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
