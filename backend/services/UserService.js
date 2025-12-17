const User = require("../models/User");
const bcrypt = require("bcrypt");

class UserService {
  // Регистрация нового пользователя
  static async register(userData) {
    const { username, password, name, surname, patronymic, department_id, birthday } = userData;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const newUser = await User.create({
      username,
      name,
      surname,
      patronymic,
      department_id,
      birthday,
      password_hash: hashedPassword
    });

    return newUser;
  }

  // Получить профиль пользователя
  static async getProfile(userId) {
    return await User.findById(userId);
  }

  // Обновить профиль
  static async updateProfile(userId, updateData) {
    return await User.update(userId, updateData);
  }

  // Получить всех пользователей
  static async getAllUsersFront(excludeUserId) {
    return await User.findAllFront(excludeUserId);
  }
  static async getAllUsers() {
    return await User.findAll();
  }
  
}

module.exports = UserService;