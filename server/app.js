const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const User = require("./models/user");
const FuelDemand = require("./models/fuelDemand"); // Import the FuelDemand model
const cors = require("cors"); // Import the cors middleware
const path = require("path"); // Import the path module

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

const MONGO_URI = "mongodb+srv://hamsoace:Sumeshu1@cluster0.atkvpq7.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "test"; // Replace with your database name

// MongoDB connection using Mongoose
mongoose.connect(`${MONGO_URI}/${DATABASE_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 1000,
  },
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Fuel Inventory System!"); // You can customize the message here
});

app.get('/fuel_demand.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../fuel_demand.html'));
});

// Route to handle form submission
app.post("/submitFuelDemand", async (req, res) => {
  const {
    customer_name,
    fuel_type,
    quantity,
    delivery_date,
    delivery_time,
  } = req.body;

  try {
    // Create a new FuelDemand document in the database
    await FuelDemand.create({
      customer_name,
      fuel_type,
      quantity,
      delivery_date,
      delivery_time,
    });

    res.status(200).send("Fuel Demand submitted successfully!");
  } catch (error) {
    console.error("Error occurred during fuel demand submission:", error);
    res
      .status(500)
      .send(
        "An error occurred during fuel demand submission. Please try again later."
      );
  }
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
  const { username, email, password } = req.body; // Use req.query to read query parameters

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
  console.log("Received fuel_type_restock:", req.body);
  console.log("Received restocked_amount:", req.body);

  try {
    // Convert the restocked_amount to a valid number
    const restockedAmount = parseInt(restocked_amount);

    // Check if restockedAmount is a valid number
    if (isNaN(restockedAmount) || restockedAmount <= 0) {
      res.status(400).send("Invalid restocked amount. Please provide a valid number.");
      return;
    }

    // Update the fuel inventory in the database
    const fuelDemand = await FuelDemand.findOne({
      fuel_type: fuel_type_restock,
    }).sort({ delivery_date: "asc" });
    const currentStock = fuelDemand ? fuelDemand.current_stock : 0;

    const newStock = currentStock + restockedAmount;

    await FuelDemand.updateOne(
      { fuel_type: fuel_type_restock },
      { $set: { current_stock: newStock } }
    );

    res.status(200).send("Fuel restocked successfully!");
  } catch (error) {
    console.error("Error occurred during fuel restock:", error);
    res.status(500).send("An error occurred during fuel restock. Please try again later.");
  }
});


app.listen(3000, () => {
  console.log("Server is running on https://b85d-196-207-137-15.ngrok-free.app");
});
