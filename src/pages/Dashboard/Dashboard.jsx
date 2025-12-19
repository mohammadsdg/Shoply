import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

function MainPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const animateOnLoad = location.state?.animate || false;

  useEffect(() => {
    if (animateOnLoad) {
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [animateOnLoad, navigate]);

  return (
    <Layout>
      <h1>داشبورد</h1>
      <p>
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده
        از طراحان گرافیک است.
      </p>
    </Layout>
  );
}

export default MainPage;
