import BaseLayout from "@/Layouts/BaseLayout";
import { Routes, Route } from "react-router-dom";
import { authRoutesPaths, protectedRoutesPaths } from "./routes";
import AppLayout from "@/Layouts/AppLayout";
import RouteGuard from "./route-guard";
const AppRoutes = () => {
  return (
    <Routes>

      {/* <AuthRoutes /> */}
      <Route path="/" element={<RouteGuard requireAuth={false} />}>
        <Route element={<BaseLayout />}>
          {authRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>


      {/* <ProtectedRoutes /> */}
      <Route path="/" element={<RouteGuard requireAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
