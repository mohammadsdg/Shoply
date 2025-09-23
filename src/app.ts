import express from "express";
import "dotenv/config";
import cors from "cors";
import materialsRoutes from "./routes/materials.ts";
import sectionsRoute from "./routes/sections.ts";
import usersRoute from "./routes/users.ts";
import shopsRoute from "./routes/shops.ts"
import brandsRoute from "./routes/brands.ts";
import alloysRoute from "./routes/alloys.ts";
import dimensionsRoute from "./routes/dimensions.ts";
import groupingsRoute from "./routes/groupings.ts";

import 'colors';
const PORT: number = parseInt(process.env.SERVER_PORT || "5000");
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1", materialsRoutes);
app.use("/api/v1", sectionsRoute);
app.use("/api/v1", usersRoute);
app.use("/api/v1", shopsRoute);
app.use("/api/v1", brandsRoute);
app.use("/api/v1", alloysRoute);
app.use("/api/v1", dimensionsRoute);
app.use("/api/v1", groupingsRoute);

// start the server
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`.cyan.underline);
    
})