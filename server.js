require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const uploadRouter = require("./routes/upload");
const productsRouter = require("./routes/product");
const paymentRouter = require("./routes/payment");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({
    useTempFiles: true
}))

// routes
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", uploadRouter);
app.use("/api", productsRouter);
app.use("/api", paymentRouter);

// connect database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("เชื่อมต่อเรียบร้อย"))
.catch((err) => console.log(err))

// port
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`start server in port ${port}`))
