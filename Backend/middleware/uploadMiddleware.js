import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "helping-hands",

    allowedFormats: [
      "jpg",
      "jpeg",
      "png",
      "pdf",
    ],
  },
});

const upload = multer({
  storage,
});

export { cloudinary };
export default upload;