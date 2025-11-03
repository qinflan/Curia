const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { fetchRecentBills, enrichBills } = require('./scripts/seedBills')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");
const billRoutes = require("./routes/bills");

app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB database!")

    await fetchRecentBills();
    await enrichBills();

    console.log("Bill fetch and enrichment complete");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));