const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
require("dotenv").config();

// Konfigurasi Cloudinary dengan Validasi
try {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary configuration is missing. Check your .env file."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error("Cloudinary Config Error:", error.message);
}

// Hanya izinkan format gambar tertentu
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("❌ Invalid file type. Only JPG, PNG, and WEBP are allowed."),
      false
    );
  }
  cb(null, true);
};

// Konfigurasi Multer (menyimpan file di memori)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB per file
});

// Fungsi upload ke Cloudinary dengan error handling lebih baik
const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "default",
        resource_type: "image",
        timeout: 60000, // Tambahkan timeout 60 detik untuk menghindari stuck request
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);

          // Menangani Error Spesifik
          if (error.http_code === 499) {
            return reject(
              new Error(
                "⏳ Request Timeout: Cloudinary tidak merespons. Periksa koneksi internet."
              )
            );
          } else if (error.http_code === 401 || error.http_code === 403) {
            return reject(
              new Error("🔑 Authentication Error: API Key atau Secret salah.")
            );
          } else if (error.message.includes("Invalid file type")) {
            return reject(new Error("❌ Format file tidak didukung."));
          }

          return reject(
            new Error(
              "⚠️ Failed to upload image to Cloudinary. Silakan coba lagi."
            )
          );
        }
        resolve(result);
      }
    );

    try {
      streamifier.createReadStream(buffer).pipe(stream);
    } catch (err) {
      console.error("❌ Stream Error:", err);
      reject(new Error("🚨 Terjadi kesalahan saat mengupload gambar."));
    }
  });
};

module.exports = { upload, uploadToCloudinary };
