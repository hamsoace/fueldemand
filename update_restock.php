<?php
$host = "localhost";
$username = "root";
$password = "root";
$dbName = "database_fuel";

// Establish database connection
$conn = new mysqli($host, $username, $password, $dbName);

// Check if the connection was successful
if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $fuelType = $_POST["fuelType"];
  $restockingAmount = $_POST["restockingAmount"];

  // Update the restock quantity in the database
  $query = "UPDATE fuel_inventory SET restock = restock + $restockingAmount WHERE fuel_type = '$fuelType'";
  $result = $conn->query($query);

  if ($result) {
    echo "Restock quantity updated successfully!";
  } else {
    echo "Error updating restock quantity: " . $conn->error;
  }
}

// Close the database connection
$conn->close();
?>
