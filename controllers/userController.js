import z from "zod";
import { userSchemaZod } from "../validations/userValidation.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create User
export const createUser = async (req, res) => {
  try {
    const parsed = userSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: z.treeifyError(parsed.error) });
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search || "";

  try {
    const query = {};

    let projection = {};
    let sortOption = { createdAt: -1 };

    if (search) {
      // Sử dụng biểu thức chính quy (case-insensitive) để tìm kiếm
      // trên các trường 'name' và 'email'
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, totalDocs] = await Promise.all([
      User.find(query) // <-- dùng query + projection
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(query), // <-- đếm theo query, không phải estimated
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    res.json({ users, limit, page, totalPages, totalDocs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single User
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const partialSchema = userSchemaZod.partial();
    const parsed = partialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: z.treeifyError(parsed.error) });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const parsed = userSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: z.treeifyError(parsed.error) });
    }

    const { name, email, password } = req.body;
    const existed = await User.find({ email });
    console.log("existed", existed);
    if (existed.length)
      return res.status(400).json({ message: "Email existed" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    res.json({ message: "Register successs", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
