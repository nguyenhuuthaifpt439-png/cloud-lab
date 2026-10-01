import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Linh hoạt: Tự động nhận API_URL từ biến môi trường hoặc dùng Localhost mặc định
  const API_URL = 'http://localhost:5000/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thay đổi ô nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert('Cập nhật thông tin sinh viên thành công!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
        alert('Thêm sinh viên thành công!');
      }
      
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      const serverMessage = error.response?.data?.message || 'Thao tác thất bại!';
      alert(`Lỗi: ${serverMessage}`);
    }
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Xóa sinh viên thành công!');
        fetchStudents();
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
        alert('Xóa sinh viên thất bại!');
      }
    }
  };

  // Chuẩn bị dữ liệu để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Quản Lý Sinh Viên Version 2.0</h1>

      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>MSSV: </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Nhập MSSV (VD: SV002)"
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div>
            <label>Họ và Tên: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập Họ và Tên"
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập Email"
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: editingId ? '#28a745' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editingId ? 'Lưu Cập Nhật' : 'Thêm Sinh Viên'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2>Danh Sách Sinh Viên</h2>
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((st) => (
                <tr key={st._id}>
                  <td>{st.studentId}</td>
                  <td>{st.name}</td>
                  <td>{st.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(st)}
                      style={{ marginRight: '8px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(st._id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;