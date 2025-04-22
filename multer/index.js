const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");

const path = require("path");
const { error } = require("console");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },

  filename: (req, file, callback) => {
    const filename = Date.now() + path.extname(file.originalname);
    callback(null, filename);
  },
});

//filtering the image;
//file.mimetype.startsWith("image/")
const imageFilter = (req, file, callback) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    callback(null, true);
  } else {
    callback(new Error("sorry this type of image not allowed"), false);
  }
};

//now defining the multer;
const uploadFile = multer({
  //jo hamne upper multerbanaya hain usko dete hain;
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  imageFilter: imageFilter,
});

app.get("/", (req, res) => {
  res.render("form");
});

// app.post("/submitform", uploadFile.single("userfile"), (req, res) => {
//   console.log("hey i am post ");
//   res.send(req.files);
// });

//

app.post("/submitform", uploadFile.array("userfile", 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("file does not uplaoded");
  }

  res.send(req.files); //! for multiuples file jo ki arrray mein aa rha hain
  // const oldPath = req.file.path; // old path with filename
  // const newFilename =
  //   "newname_" + Date.now() + path.extname(req.file.originalname);
  // const newPath = path.join("uploads", newFilename); // path to new filename

  // fs.rename(oldPath, newPath, (err) => {
  //   if (err) {
  //     console.error("Rename failed:", err);
  //     return res
  //       .status(500)
  //       .send("Something went wrong while renaming the file.");
  //   }

  //   console.log("File renamed successfully.");
  //   res.send({
  //     message: "File uploaded and renamed successfully!",
  //     newFilename: newFilename,
  //     filePath: newPath,
  //   });
  // });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send("to May file uploaded plase reduce the file");
    }
    return res.status(400).send(`your Error is :${error.message}`);
  } else if (error) {
    return res.status(500).send(`your Error is :${error.message}`);
  }
  next();
});

// app.post("/submitform", uploadFile.single("userfile"), (req, res) => {
//   const oldPath = req.file.path; // old path with filename
//   const newFilename =
//     "image" + Date.now() + path.extname(req.file.originalname);
//   const newPath = path.join("uploads", newFilename); // path to new filename

//   fs.rename(oldPath, newPath, (err) => {
//     if (err) {
//       console.error("Rename failed:", err);
//       return res
//         .status(500)
//         .send("Something went wrong while renaming the file.");
//     }

//     console.log("File renamed successfully.");
//     res.send({
//       message: "File uploaded and renamed successfully!",
//       newFilename: newFilename,
//       filePath: newPath,
//     });
//   });
// });

app.listen(3000, (req, res) => {
  console.log("server is running");
});
