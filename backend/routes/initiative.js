const express = require("express");
const router = express.Router();
const Initiative = require("../models/Initiative");
router.post("/", async (req, res) => {
    console.log("Initiative created:");
  console.log("Body:", req.body);
  try {
    const newInit = await Initiative.create(req.body);
    console.log("Initiative created:", newInit);
    res.status(201).json(newInit);
  } catch (error) {
    console.error("Error creating initiative:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("Requested initiative for user:", userId);

  try {
    const initiative = await Initiative.findById(userId);

    console.log(initiative);

    res.json(initiative);
  } catch (error) {
    console.error("Error fetching initiative:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
