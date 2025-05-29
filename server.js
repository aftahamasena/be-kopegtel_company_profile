require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./middlewares/corsMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./routes/verifyToken");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const contactRoutes = require("./routes/contactRoutes");
const awardRoutes = require("./routes/awardRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogpostRoutes = require("./routes/blogpostRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api", verifyToken);
app.use("/api/user", userRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/award", awardRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/blogpost", blogpostRoutes);

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
