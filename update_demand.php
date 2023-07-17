<?php
$host = "localhost";
$username = "root";
$password = "password";
$dbName = "database_fuel";

// Establish database connection
$conn = new mysqli($host, $username, $password, $dbName);

// Check if the connection was successful
if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $fuelType = $_POST["fuelType"];
  $demandAmount = $_POST["demandAmount"];

  // Update the demand quantity in the database
  $query = "UPDATE fuel_inventory SET demand = demand + $demandAmount WHERE fuel_type = '$fuelType'";
  $result = $conn->query($query);

  if ($result) {
    echo "Demand quantity updated successfully!";
  } else {
    echo "Error updating demand quantity: " . $conn->error;
  }
}

// Close the database connection
$conn->close();
?>
