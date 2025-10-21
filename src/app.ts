
import express from "express";
import "dotenv/config";
import cors from "cors";

import materialsRoutes from "./routes/materials.js";
import sectionsRoute from "./routes/sections.js";
import usersRoute from "./routes/users.js";
import shopsRoute from "./routes/shops.js"
import brandsRoute from "./routes/brands.js";
import alloysRoute from "./routes/alloys.js";
import dimensionsRoute from "./routes/dimensions.js";
import groupingsRoute from "./routes/groupings.js";
import productsRoute from "./routes/products.js";
import shopProductsRoute from "./routes/shop-products.js";
import productsSizeRoute from "./routes/products-size.js";
import stockItemsRoute from "./routes/stock-items.js";
import preInvoice from "./routes/pre-invoices.js";

import 'colors';
const PORT: number = parseInt(process.env.SERVER_PORT || "8000");
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
app.use("/api/v1", productsRoute);
app.use("/api/v1", shopProductsRoute);
app.use("/api/v1", productsSizeRoute);
app.use("/api/v1", stockItemsRoute);
app.use("/api/v1", preInvoice);
// start the server
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`.cyan.underline);
})