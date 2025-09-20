import express from "express";
import "dotenv/config";
import cors from "cors";
import materialsRoutes from "./routes/materials.ts";
import sectionsRoute from "./routes/sections.ts";
import usersRoute from "./routes/users.ts";
import shopsRoute from "./routes/shops.ts"
import 'colors';
const PORT: number = parseInt(process.env.SERVER_PORT || "5000");
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1", materialsRoutes);
app.use("/api/v1", sectionsRoute);
app.use("/api/v1", usersRoute);
app.use("/api/v1", shopsRoute)

// start the server
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`.cyan.underline);
    
})