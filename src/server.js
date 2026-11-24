const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Health Check API
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running successfully"
  });
});

// Items API
app.get("/items", (req, res) => {
  res.status(200).json({
    items: [
      { id: 1, name: "Laptop" },
      { id: 2, name: "Mobile" },
      { id: 3, name: "Keyboard" }
    ]
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
