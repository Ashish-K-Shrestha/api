import multer from "multer";
import path from "path";

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ✅ Preserve file extension
    cb(null, `${Date.now()}${ext}`); // ✅ Append extension to filename
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("File format not supported."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
}).single("profilePicture");

export default upload; // ✅ Use ES module export
