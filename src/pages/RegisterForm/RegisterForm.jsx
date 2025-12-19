import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

import api from "../../api";

const RegisterForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username: userName, password };

    try {
      const response = await api.post("/register", userData);

      if (response.data.success) {
        toast.success("کاربر با موفقیت ایجاد شد");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("کاربر از قبل وجود دارد");
        } else if (err.response.status === 500) {
          toast.error("خطای سرور رخ داد");
        } else if (err.response.status === 404) {
          toast.error("کاربری یافت نشد");
        } else {
          toast.error(err.response.data.message || "مشکلی پیش آمد");
        }
      } else {
        toast.error("ارتباط با سرور برقرار نشد");
      }

      console.log(err);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            flex: 1,
            backgroundImage: "url(/images/iron-main.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "block",
          }}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2b2b2b",
            p: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              sx={{
                width: 380,
                borderRadius: 3,
                boxShadow: 6,
                p: 4,
                textAlign: "center",
                backgroundColor: "rgba(20, 20, 20, 0.9)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Box
                  component="img"
                  src="/images/shoply.png"
                  alt="Shoply Logo"
                  sx={{
                    width: 150,
                    height: 150,
                    objectFit: "contain",
                    mb: 3,
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#ff7043", mb: 3 }}
                >
                  ثبت نام
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label="نام کاربری"
                      variant="outlined"
                      fullWidth
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      InputLabelProps={{ style: { color: "#ccc" } }}
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#555" },
                          "&:hover fieldset": { borderColor: "#888" },
                        },
                      }}
                    />
                    <TextField
                      label="رمز ورود"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputLabelProps={{ style: { color: "#ccc" } }}
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#555" },
                          "&:hover fieldset": { borderColor: "#888" },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#ff5722",
                        "&:hover": { backgroundColor: "#e64a19" },
                        fontWeight: "600",
                      }}
                    >
                      ثبت نام
                    </Button>
                  </Stack>
                </Box>

                <Typography sx={{ mt: 2, fontSize: "0.9rem", color: "#ccc" }}>
                  حساب کاربری دارید؟{" "}
                  <Box
                    component={Link}
                    to="/login"
                    sx={{
                      color: "#ff7043",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    ورود
                  </Box>
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </>
  );
};

export default RegisterForm;
