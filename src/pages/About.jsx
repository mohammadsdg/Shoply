import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const About = () => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(
          "http://156.255.1.98:8000/api/v1/shops"
        );
        setShopData(response.data.body[0]); // Assuming the API returns the provided JSON structure
        setLoading(false);
      } catch (err) {
        setError("خطا در بارگذاری اطلاعات فروشگاه");
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Layout sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          درباره ما
        </Typography>
        <Typography variant="body1" color="text.secondary">
          اطلاعات مربوط به فروشگاه ما را در زیر مشاهده کنید.
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            نام فروشگاه: {shopData.name || "نامشخص"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            شماره تماس: {shopData.phone || "نامشخص"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            تاریخ ایجاد:{" "}
            {new Date(shopData.created_at).toLocaleDateString("fa-IR") ||
              "نامشخص"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            ما یک فروشگاه متعهد به ارائه بهترین خدمات به فردان خود هستیم.
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default About;
