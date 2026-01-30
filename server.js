const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.send("✅ Login successful!");
  } else {
    res.send("❌ Invalid credentials");
  }
});

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json"));

  if (users.find(u => u.username === username)) {
    return res.send("⚠️ User already exists!");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.send("🎉 Registration successful!");
});

app.listen(3000, () => console.log("Mini-auth running on http://localhost:3000"));
