import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddProject from "./pages/AddProject";
import AllProjects from "./pages/AllProjects";
import UpdateProject from "./pages/UpdateProject";
import AddBlog from "./pages/AddBlog";
import AllBlogs from "./pages/AllBlogs";
import AllTestimonials from "./pages/AllTestimonials";
import AddTestimonail from "./pages/AddTestimonail";
import AllFaq from "./pages/AllFaq";
import ContactSettings from "./pages/ContactSettings";
import AllLeads from "./pages/AllLeads";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-navy-light !text-cream !border !border-gold/20"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addProject" element={<AddProject />} />
          <Route path="/allProjects" element={<AllProjects />} />
          <Route path="/updateProject/:id" element={<UpdateProject />} />
          <Route path="/allBlogs" element={<AllBlogs />} />
          <Route path="/addBlog" element={<AddBlog />} />
          <Route path="/allTestimonials" element={<AllTestimonials />} />
          <Route path="/addTestimonial" element={<AddTestimonail />} />
          <Route path="/allFaq" element={<AllFaq />} />
          <Route path="/contactSettings" element={<ContactSettings />} />
          <Route path="/allLeads" element={<AllLeads />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
