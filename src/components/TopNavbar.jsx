import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Moon, Sun, Users, Calendar, DollarSign,
  TrendingUp, BarChart2, Home, Settings, User, MessageSquare
} from "lucide-react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";

export default function TopNavbar() {
  const [notifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Navbar expand="lg" style={{background:"linear-gradient(135deg,#667eea,#764ba2)"}}>
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

            <NavDropdown title={<span className="text-white"><Users size={18}/> Employees</span>}>
              <NavDropdown.Item as={Link} to="/app/employees">Employees</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/attendance">Attendance</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/payroll">Payroll</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/analytics">Analytics</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/app/settings" className="text-white">
              <Settings size={18}/> Settings
            </Nav.Link>
          </Nav>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">
            <Form.Control placeholder="Search..." style={{width:"250px"}} />

            <Button variant="light">
              <MessageSquare size={18}/>
            </Button>

            <NavDropdown
              align="end"
              title={<Bell color="white"/>}
            >
              <NavDropdown.Header>
                Notifications <Badge bg="danger">{notifications}</Badge>
              </NavDropdown.Header>
              <NavDropdown.Item>New employee joined</NavDropdown.Item>
              <NavDropdown.Item>Leave approved</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<User color="white"/>} align="end">
              <NavDropdown.Item as={Link} to="/app/profile">Profile</NavDropdown.Item>
            </NavDropdown>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
