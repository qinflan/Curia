const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { fetchRecentBills, enrichBills } = require('./services/bills')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");

app.use("/api/users", userRoutes);

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