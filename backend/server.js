const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const disasterRoutes = require("./routes/disasterRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Fix CORS Issue
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow requests only from frontend
    credentials: true, // ✅ Allow cookies/auth headers
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/disasters", disasterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
