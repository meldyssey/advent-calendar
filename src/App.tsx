import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { logout } from "./firebase/auth";


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Button variant="outline" disabled size="sm">
          <Spinner />
            Please wait
        </Button>
      </div>
    )
  }

  if (!user){
    return <LoginForm />
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1>Hello, {user.displayName || user.email}</h1>
      <Button onClick={logout}>로그아웃</Button>
    </div>
  )
}

export default App;