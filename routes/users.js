import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 */

// router.get("/users", auth, getUsers);
router.get("/users", getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết 1 user theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/users/:id", auth, getUserById);

router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Tạo user mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo user thành công
 */
router.post("/users/register", registerUser);
// Đăng nhập

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng nhập thành công
 */
router.post("/users/login", loginUser);

/**
 * @swagger
 * /api/me:
 *  get:
 *    summary: Lấy thông tin người dùng hiện tại
 *    tags: [Users]
 *    responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 */

router.get("/me", auth, (req, res) => {
  console.log("req", req);
  const user = req.user;
  res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
