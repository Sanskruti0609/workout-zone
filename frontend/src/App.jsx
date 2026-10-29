import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Trainers from "./pages/Trainers.jsx";
import Timings from "./pages/Timings.jsx";
import Memberships from "./pages/Memberships.jsx";
import Supplements from "./pages/Supplements.jsx";
import Contact from "./pages/Contact.jsx";
import Hyrox from "./pages/Hyrox.jsx";
import Yoga from "./pages/Yoga.jsx";
import Facilities from "./pages/Facilities.jsx";
import RecoveryServices from "./pages/RecoveryServices.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import AdminBusiness from "./pages/admin/AdminBusiness.jsx";
import * as Admin from "./pages/admin/resources.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/timings" element={<Timings />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/hyrox" element={<Hyrox />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/recovery" element={<RecoveryServices />} />
        <Route path="/supplements" element={<Supplements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="business" element={<AdminBusiness />} />
          <Route path="trainers" element={<Admin.Trainers />} />
          <Route path="timings" element={<Admin.Timings />} />
          <Route path="memberships" element={<Admin.Memberships />} />
          <Route path="services" element={<Admin.Services />} />
          <Route path="supplements" element={<Admin.Supplements />} />
          <Route path="promotions" element={<Admin.Promotions />} />
          <Route path="gallery" element={<Admin.Gallery />} />
          <Route path="testimonials" element={<Admin.Testimonials />} />
        </Route>
      </Route>
    </Routes>
  );
}
