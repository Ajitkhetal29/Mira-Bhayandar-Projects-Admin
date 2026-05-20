import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
export const AppConetxt = createContext();

const AppConetxtProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [allBlogs, setAllblogs] = useState([]);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [allFaq, setAllFaq] = useState([]);
  const [leadCounts, setLeadCounts] = useState({ todayCount: 0, totalCount: 0 });

  // fetch all projects
  const getAllProjects = async () => {
    console.log("getAllProjects  called");

    try {
      const response = await axios.get(
        `${backendUrl}/api/project/allProjects?includeInactive=true`
      );
      if (response.data.success) {
        setAllProjects(response.data.allProjects);
        console.log("getAllProjects  success");
      } else {
        console.log(response.data.message);
        console.log("getAllProjects  error-1alled");
      }
    } catch (error) {
      console.log(error);
      console.log("getAllProjects  error");
    }
  };

  // delete project
  const deleteProject = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/project/deleteProject`,
        {
          id,
        }
      );
      if (response.data.success) {
        toast.warning("Project Delered", { autoClose: 2000 });

        getAllProjects();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // logout
  const logout = async () => {
    localStorage.removeItem("token");
    toast.warning("Logout Succesfull", { autoClose: 2000 });

    setToken("");
    navigate("/");
  };

  // blogs

  // fetch all blogs
  const getAllBlogs = async () => {
    console.log("getAllBlogs  called");

    try {
      const response = await axios.get(`${backendUrl}/api/blog/allBlogs`);
      if (response.data.success) {
        setAllblogs(response.data.allblogs);
        console.log("getAllBlogs  success");
      } else {
        console.log(response.data.message);
        console.log("getAllBlogs  error-1");
      }
    } catch (error) {
      console.log(error);
          console.log("getAllBlogs  error");

    }
  };

  // delete blog
  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/blog/deleteBlog/${id}`
      );
      if (response.data.success) {
        toast.warning("Blog Deleted", { autoClose: 2000 });
        getAllBlogs();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // testimonials

  // get testimonials
  const getAllTestimonials = async () => {
    console.log("getAllTestimonials called ");

    try {
      const response = await axios.get(
        `${backendUrl}/api/testimonial/allTestimonials`
      );
      if (response.data.success) {
        setAllTestimonials(response.data.allTestimonials);
        console.log("getAllTestimonials success ");
      } else {
        console.log(response.data.message);
        console.log("getAllTestimonials error -1 ");
      }
    } catch (error) {
      console.log(error);
      console.log("getAllTestimonials error ");
    }
  };

  // delete testimonial
  const deleteTestimonial = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/testimonial/deleteTestimonial/${id}`
      );
      if (response.data.success) {
        toast.warning("Testimonial Deleted", { autoClose: 2000 });
        getAllTestimonials();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FAQ

  // get FAQ
  const getAllFaq = async () => {
    console.log("getAllFaq called ");

    try {
      const response = await axios.get(`${backendUrl}/api/faq/allFaqs`);
      if (response.data.success) {
        setAllFaq(response.data.allFaqs);
        console.log("getAllFaq success ");
      } else {
        console.log(response.data.message);
        console.log("getAllFaq error -1 ");
      }
    } catch (error) {
      console.log(error);
      console.log("getAllFaq error ");
    }
  };

  // delete FAQ
  const deleteFaq = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/faq/deleteFaq/${id}`
      );
      if (response.data.success) {
        toast.warning("FAQ Deleted", { autoClose: 2000 });
        getAllFaq();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLeadCounts = async () => {
    const auth = token || localStorage.getItem("token");
    if (!auth) return;
    try {
      const response = await axios.get(`${backendUrl}/api/lead/counts`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      if (response.data.success) {
        setLeadCounts({
          todayCount: response.data.todayCount ?? 0,
          totalCount: response.data.totalCount ?? 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch data on refresh or reload
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    getAllProjects();
    getAllBlogs();
    getAllTestimonials();
    getAllFaq();
    if (localStorage.getItem("token")) {
      getLeadCounts();
    }
  }, []);

  const value = {
    backendUrl,
    token,
    navigate,
    setToken,
    getAllProjects,
    allProjects,
    deleteProject,
    logout,
    getAllBlogs,
    deleteBlog,
    allBlogs,
    getAllTestimonials,
    allTestimonials,
    deleteTestimonial,
    allFaq,
    getAllFaq,
    deleteFaq,
    leadCounts,
    getLeadCounts,
  };

  return (
    <AppConetxt.Provider value={value}>{props.children}</AppConetxt.Provider>
  );
};

export default AppConetxtProvider;
