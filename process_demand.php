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

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["submit_fuel"])) {
  // Retrieve the form data
  $customerName = $_POST["customer_name"];
  $fuelType = $_POST["fuel_type"];
  $quantity = $_POST["quantity"];
  $deliveryDate = $_POST["delivery_date"];
  $deliveryTime = $_POST["delivery_time"];

  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO fuel_demand (customer_name, fuel_type, quantity, delivery_date, delivery_time) VALUES (?, ?, ?, ?, ?)");
  $stmt->bind_param("ssiss", $customerName, $fuelType, $quantity, $deliveryDate, $deliveryTime);

  // Execute the statement
  if ($stmt->execute()) {
    echo "Fuel demand submitted successfully!";
  } else {
    echo "Error submitting fuel demand: " . $stmt->error;
  }

  // Close the statement
  $stmt->close();
}

// Close the database connection
$conn->close();
?>
