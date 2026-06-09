import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {

    cb(
      null,
      `${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpg|jpeg|png|pdf/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);

  } else {

    cb(
      new Error(
        "Only images and PDFs are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;