const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const { pool } = require("./config/dbConfig");
const initializePassport = require("./config/passportConfig");

const authRoutes = require("./routes/auth");
const depRoutes = require("./routes/departments");
const usersRoutes = require("./routes/users");
const wishRoutes = require("./routes/wishes");
const uploadRoutes = require("./routes/upload");
const commentRoutes = require("./routes/comments");
const iniitRoutes = require("./routes/initiative");
initializePassport(passport);

const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
  origin: true,  // автоматически разрешает текущий origin
  credentials: true, // Разрешить передачу кук
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized: false, 
    cookie: {
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      httpOnly: true // защита от XSS
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/debug-cookies", (req, res) => {
  res.json({
    cookies: req.headers.cookie || 'No cookies',
    sessionId: req.sessionID,
    session: req.session
  });
});

app.get("/", (req, res) => {
  res.send("Hello?");
});

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/departments", depRoutes);
app.use("/wishes", wishRoutes);
app.use("/upload", uploadRoutes);
app.use("/comments", commentRoutes);
app.use("/initiative", iniitRoutes);

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Ошибка подключения к БД:", err);
  }
  console.log("Подключение к БД успешно");
  release();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
