const express = require("express");
const router = express.Router();
const Wish = require("../models/Wish");
router.get("/single/:wishId", async (req, res) => {
  const wishId = req.params.wishId;
  console.log(wishId);
  try {
    const wish = await Wish.FindById(wishId);
    console.log(wish);
    res.json(wish);
  } catch (error) {
    console.error("Error fetching all wishes:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const wishes = await Wish.findAll(userId);
    console.log(wishes);
    res.json({ wishes });
  } catch (error) {
    console.error("Error fetching all wishes:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/:wishId", async (req, res) => {
  console.log("📨 PUT /wishes/:wishId");
  console.log("wishId:", req.params.wishId);
  console.log("body:", req.body);

  try {
    const updatedWish = await Wish.update(req.params.wishId, req.body);
    console.log("✅ Успешно обновлено:", updatedWish);
    res.json({ updatedWish });
  } catch (error) {
    console.error("❌ Ошибка в Wish.update:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Server error",
      message: error.message,
      details: error.detail, // для PostgreSQL ошибок
    });
  }
});
router.delete("/:wishId", async (req, res) => {
  console.log("delete wish");
  const wishId = req.params.wishId;
  try {
    const wishes = await Wish.delete(wishId);
    res.json("Wish deleted");
  } catch (error) {
    console.error("Error deleting wish:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/", async (req, res) => {
  console.log("📨 POST /wishes - Creating new wish");
  console.log("Body:", req.body);

  try {
    const newWish = await Wish.create(req.body);
    console.log("✅ Wish created:", newWish);
    res.status(201).json(newWish);
  } catch (error) {
    console.error("❌ Error creating wish:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
