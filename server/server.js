const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/uploads", express.static("public/uploads"));
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api/auth/", require("./routes/auth"));
app.use("/api/user/", require("./routes/user"));
app.use("/api/follow/", require("./routes/follow"));
app.use("/api/post/", require("./routes/post"));
app.use("/api/post/comment/", require("./routes/comment"));

app.get("/", (req, res) => {
  res.status(200).send("Server Running....");
});

app.listen(PORT, () => console.log("Server running"));
