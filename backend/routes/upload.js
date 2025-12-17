const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool } = require("../config/dbConfig");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/data");
    },
    filename: (req, file, cb) => {
        const username = req.user.user_id; 
        const ext = path.extname(file.originalname);
        cb(null, `${username}${ext}`);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("avatar"), async (req, res) => {
   try {
        console.log(req.file);

        const userId = req.user.user_id; // предполагаем, что есть auth middleware
        const filename = req.file.filename;

        // Обновляем пользователя в БД
        await pool.query(
            `UPDATE users SET profile_picture = $1 WHERE user_id = $2`,
            [filename, userId]
        );

        res.json({ ok: true, filename });
    } catch (error) {
        console.error("Ошибка при сохранении аватарки в БД:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    console.log(filename);
    const filePath = path.join("/data", filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

module.exports = router;
