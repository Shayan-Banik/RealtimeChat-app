import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import AppRoutes from "./routes";
import { Spinner } from "./components/ui/spinner";
import { useLocation } from "react-router-dom";
import { isAuthRoute } from "./routes/routes";
import { useSocket } from "./hooks/use-socket";

function App() {
  const { user, isAuthStatusLoading, isAuthStatus } = useAuth();
  const {pathname} = useLocation();
  const { onlineUsers } = useSocket();
  const isAuth = isAuthRoute(pathname)

  console.log("Online Users", onlineUsers);
  

  useEffect(() => {
    isAuthStatus();
  }, [isAuthStatus]);

  if (isAuthStatusLoading && !user && !isAuth) {
    return (
      <div className=" flex flex-col justify-center items-center h-screen ">
        {/* Logo */}
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
