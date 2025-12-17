const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
router.get("/:wishId", async (req, res) => {
  const wishId = req.params.wishId;
  console.log("Requested wishId:", wishId);

  try {
    const comments = await Comments.findAll(wishId);

    console.log(comments);

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/:commentId", async (req, res) => {
  console.log("delete wish");
  const commentId = req.params.commentId;
  try {
    const comm = await Comments.delete(commentId);
    res.status(204);
  } catch (error) {
    console.error("Error deleting wish:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  console.log("Body:", req.body);
  try {
    const newComm = await Comments.create(req.body);
    console.log("Comm created:", newComm);
    res.status(201).json(newComm);
  } catch (error) {
    console.error("❌ Error creating comm:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;