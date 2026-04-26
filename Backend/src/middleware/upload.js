const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "linkcart-products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
        if (!allowed.has(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
        }
        cb(null, true);
    },
});

module.exports = upload;
