const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");  // Middleware for parsing request bodies
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleware/errorMiddleware"); // Note: Middleware corrected to match typical naming conventions
const cookieParser = require("cookie-parser");

// Initialize the app
const app = express();

// Middleware setup
app.use(
    cors({
      origin: ["http://localhost:3000", "https://inventory-frontend-teal.vercel.app/"],
      credentials: true,
    })
  );
  
  

app.use(express.json()); // Middleware to handle JSON data
app.use(express.urlencoded({ extended: false })); // Middleware to handle URL-encoded data
app.use(bodyParser.json()); // Middleware to handle JSON data
app.use(cookieParser()); // Middleware to handle cookies

// Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// Default route
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running at ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });