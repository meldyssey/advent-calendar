import FirebaseConnectTest from './components/FirebaseConnectTest';
import { Button } from "@/components/ui/button"


function App() {
  return (
    <>
      <FirebaseConnectTest />
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            🎄 shadcn/ui 설치 완료!
          </h1>
          <Button>클릭해보세요</Button>
        </div>
      </div>
    </>
  );
}

export default App;