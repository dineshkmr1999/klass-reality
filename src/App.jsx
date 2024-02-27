import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/admin/login/Login";
import { ProtectedRoutes } from "./services/ProtectedRouter";
import AdminLayout from "./pages/admin/layout/AdminLayout";
import Experience from "./pages/admin/experience/Experience";
import Dashboard from "./pages/admin/systemadmin/dashboard/Dashboard";
import Client from "./pages/admin/systemadmin/client/Client";
import Subscription from "./pages/admin/systemadmin/subscription/Subsciption";
import Roles from "./pages/admin/systemadmin/roles/Roles";
import ViewExperience from "./pages/admin/experience/view/ViewExperience";
import ViewClient from "./pages/admin/systemadmin/client/ViewClient";
import ViewFrameModel from "./pages/admin/experience/view/ViewFrameModel";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index path="/experience" element={<Experience />} />
          <Route index path="/experience/:id" element={<ViewExperience />} />
          <Route index path="/viewframemodel" element={<ViewFrameModel />} />
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route index path="/client" element={<Client />} />
          <Route index path="/subscription" element={<Subscription />} />
          <Route index path="/client/:id" element={<ViewClient />} />
          <Route index path="/roles" element={<Roles />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
