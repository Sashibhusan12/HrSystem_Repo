import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";

import {
  Bell, User, Settings, LogOut,
  Users, Calendar, TrendingUp,
  Moon, Sun, MessageSquare,
  DollarSign, BarChart2, Home
} from "lucide-react";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications] = useState(5);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const notificationItems = [
    { id: 1, text: "New employee onboarding", time: "5m ago" },
    { id: 2, text: "Leave request approved", time: "1h ago" },
    { id: 3, text: "Meeting in 30 minutes", time: "2h ago" },
  ];

  return (
    <Navbar expand="lg" className="bg-primary shadow sticky-top">
      <Container fluid>

        <Navbar.Brand as={Link} to="/app" className="text-white fw-bold">
          <BarChart2 className="me-2"/> HR Elite
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>

          {/* LEFT MENU */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/app" className="text-white">
              <Home size={18}/> Dashboard
            </Nav.Link>

            <NavDropdown title="Employees" className="text-white">
              <NavDropdown.Item as={Link} to="/app/employees">
                <Users size={16}/> Employees
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/attendance">
                <Calendar size={16}/> Attendance
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/payroll">
                <DollarSign size={16}/> Payroll
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/analytics">
                <TrendingUp size={16}/> Analytics
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/app/settings" className="text-white">
              <Settings size={18}/> Settings
            </Nav.Link>
          </Nav>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3">
            <Form className="d-none d-lg-flex">
              <Form.Control placeholder="Search..." />
            </Form>

            <Button variant="light" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </Button>

            <Button variant="light">
              <MessageSquare size={18}/>
            </Button>

            <NavDropdown
              title={<span className="text-white"><Bell size={18}/> <Badge bg="danger">{notifications}</Badge></span>}
              align="end"
            >
              {notificationItems.map((n) => (
                <NavDropdown.Item key={n.id}>
                  {n.text} • {n.time}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <NavDropdown title={<User size={20} color="white"/>} align="end">
              <NavDropdown.Item as={Link} to="/app/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider/>
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
