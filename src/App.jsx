import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import "./App.css";
import AddProject from "./pages/AddProject";
import Navbar from "./components/Navbar";
import AllProjects from "./pages/AllProjects";
import UpdateProject from "./pages/UpdateProject";
import { ToastContainer } from "react-toastify";
import AddBlog from "./pages/AddBlog";
import AllBlogs from "./pages/AllBlogs";
import AllTestimonials from "./pages/AllTestimonials";
import AddTestimonail from "./pages/AddTestimonail";
import AllFaq from "./pages/AllFaq";
import ContactSettings from "./pages/ContactSettings";
import AllLeads from "./pages/AllLeads";
import { AppConetxt } from "./context/context";

const App = () => {
  const { navigate } = useContext(AppConetxt);
  const [logged, setLogged] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      setLogged(false);
    } else {  
      // navigate("/dashboard");
      setLogged(true);
    }
  }, [localStorage.getItem("token")]);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        {logged && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
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
        </Routes>
      </div>
    </>
  );
};

export default App;
