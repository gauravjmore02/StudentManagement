import { useEffect, useState } from "react";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import axios from "axios";

const API = "http://localhost:3000"; 

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    mob: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/students/updt/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(`${API}/students/save`, formData);
      }

      setFormData({ name: "", city: "", mob: "" });
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      city: student.city,
      mob: student.mob,
    });
    setEditId(student.id);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API}/students/dlt/${id}`);
        fetchStudents();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Students</h2>

      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Mobile"
              name="mob"
              value={formData.mob}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={3}>
            <Button type="submit" variant="primary" className="w-100">
              {editId ? "Update" : "Save"}
            </Button>
          </Col>
        </Row>
      </Form>

      
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu.id}>
              <td>{stu.id}</td>
              <td>{stu.name}</td>
              <td>{stu.city}</td>
              <td>{stu.mob}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(stu)}
                  className="me-2"
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(stu.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
