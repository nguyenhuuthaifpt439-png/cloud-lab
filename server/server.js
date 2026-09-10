const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ===================================================
// BẮT BUỘC: Đặt CORS ở đầu tiên trước tất cả middleware
// ===================================================
app.use(cors({
  origin: [
    'https://automatic-eureka-4qvp65rw7jqhq6gv-5173.app.github.dev'
    ] , // Cho phép tất cả miền (domain) truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Nhận dữ liệu JSON từ request body
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// ===================================================
// CÂU 35: Tạo Schema & Model Student
// ===================================================
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// ===================================================
// CÂU 36: API GET /api/students - Lấy danh sách sinh viên
// ===================================================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===================================================
// CÂU 37: API POST /api/students - Thêm sinh viên
// ===================================================
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================================================
// CÂU 38: API PUT /api/students/:id - Cập nhật sinh viên
// ===================================================
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================================================
// CÂU 39: API DELETE /api/students/:id - Xóa sinh viên
// ===================================================
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});