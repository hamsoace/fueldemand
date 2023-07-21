const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const User = require("./models/user");
const FuelDemand = require("./models/fuelDemand"); // Import the FuelDemand model

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const MONGO_URI =
  "mongodb+srv://hamsoace:Sumeshu1@cluster0.atkvpq7.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "test"; // Replace with your database name

// MongoDB connection using Mongoose
mongoose.connect(`${MONGO_URI}/${DATABASE_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Fuel Inventory System!"); // You can customize the message here
});

// Login route
app.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find the user in the database based on username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (user && user.password === password) {
      res.redirect("/fuel_demand.html");
    } else {
      res.status(401).send("Invalid username or password. Please try again.");
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).send("Internal server error.");
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.query; // Use req.query to read query parameters

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      res.status(409).send("Username or email already exists.");
    } else {
      // Create a new user in the database
      await User.create({ username, email, password });
      res.sendStatus(200); // Send a success response
    }
  } catch (error) {
    console.error("Error occurred during sign up:", error);
    res.status(500).send("Internal server error.");
  }
});

// Fuel demand form route
app.post("/fuelRestock", async (req, res) => {
  const { fuel_type_restock, restocked_amount } = req.body;

  try {
    // Update the fuel inventory in the database
    const fuelDemand = await FuelDemand.findOne({
      fuel_type: fuel_type_restock,
    }).sort({ delivery_date: "asc" });
    const currentStock = fuelDemand ? fuelDemand.current_stock : 0;

    const newStock = currentStock + parseInt(restocked_amount);

    await FuelDemand.updateOne(
      { fuel_type: fuel_type_restock },
      { $set: { current_stock: newStock } }
    );

    res.status(200).send("Fuel restocked successfully!");
  } catch (error) {
    console.error("Error occurred during fuel restock:", error);
    res
      .status(500)
      .send("An error occurred during fuel restock. Please try again later.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
