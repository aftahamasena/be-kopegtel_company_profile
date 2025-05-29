const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:2025", // Sesuaikan dengan frontend
  credentials: true, // Izinkan cookies/token dikirim
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:2025");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  cors(corsOptions)(req, res, next);
};
