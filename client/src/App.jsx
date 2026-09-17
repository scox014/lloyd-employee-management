import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Space,
    Card,
    Statistic,
    Row,
    Col,
} from "antd";
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loginForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    // Check login status when the application starts
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn");

        if (loggedIn === "true") {
            setIsLoggedIn(true);
        }
    }, []);
    // Get employees after login
    useEffect(() => {
        if (isLoggedIn) {
            fetchEmployees();
        }
    }, [isLoggedIn]);
    // Fetch all employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/employees"
            );
            const data = await response.json();
            if (response.ok) {
                setEmployees(data);
            } else {
                message.error("Error fetching employees");
            }
        } catch (error) {
            message.error("Cannot connect to the server");
        }
    };
    // Login
    const handleLogin = async (values) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Username: values.Username,
                        Password: values.Password,
                    }),
                }
            );
            const data = await response.json();

            if (response.ok) {
                message.success("Login successful");

                localStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);
            } else {
                message.error(data.message || "Invalid username or password");
            }
        } catch (error) {
            message.error("Cannot connect to the server");
        }
    };
    // Logout
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        message.success("Logged out successfully");
    };
    // Add employee
    const handleAddEmployee = async (values) => {
            const nextEmployeeNumber = `EMP-${String(
                employees.length + 1
            ).padStart(4, "0")}`;

            const employeeData = {
                ...values,
                EmployeeNumber: nextEmployeeNumber,
            };
        try {
            const response = await fetch(
                "http://localhost:5000/api/employees",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(employeeData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                message.success("Employee added successfully");

                setIsAddModalOpen(false);
                addForm.resetFields();
                fetchEmployees();
            } else {
                message.error(data.message || "Error adding employee");
            }
        } catch (error) {
            message.error("Cannot connect to the server");
        }
    };

    // Open edit modal
    const openEditModal = (employee) => {
        setSelectedEmployee(employee);

        editForm.setFieldsValue({
            EmployeeNumber: employee.EmployeeNumber,
            FirstName: employee.FirstName,
            LastName: employee.LastName,
            Email: employee.Email,
            Phone: employee.Phone,
            Department: employee.Department,
            Position: employee.Position,
            EmploymentStatus: employee.EmploymentStatus,
            DateHired: employee.DateHired
                ? employee.DateHired.substring(0, 10)
                : "",
        });

        setIsEditModalOpen(true);
    };

    // Update employee
    const handleEditEmployee = async (values) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/employees/${selectedEmployee.Id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );

            const data = await response.json();

            if (response.ok) {
                message.success("Employee updated successfully");

                setIsEditModalOpen(false);
                editForm.resetFields();
                setSelectedEmployee(null);
                fetchEmployees();
            } else {
                message.error(data.message || "Error updating employee");
            }
        } catch (error) {
            message.error("Cannot connect to the server");
        }
    };

    // Delete employee
    const handleDeleteEmployee = (id) => {
        Modal.confirm({
            title: "Delete Employee",
            content: "Are you sure you want to delete this employee?",
            okText: "Yes",
            cancelText: "No",

            onOk: async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/employees/${id}`,
                        {
                            method: "DELETE",
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {
                        message.success("Employee deleted successfully");
                        fetchEmployees();
                    } else {
                        message.error(data.message || "Error deleting employee");
                    }
                } catch (error) {
                    message.error("Cannot connect to the server");
                }
            },
        });
    };
    // Employee table columns
    const columns = [
        {   title: "ID",
            dataIndex: "Id",
            key: "Id",
        },
        {   title: "Employee Number",
            dataIndex: "EmployeeNumber",
            key: "EmployeeNumber",
        },
        { title: "First Name",
            dataIndex: "FirstName",
            key: "FirstName",
        },
        {   title: "Last Name",
            dataIndex: "LastName",
            key: "LastName",
        },
        {   title: "Email",
            dataIndex: "Email",
            key: "Email",
        },
        {   title: "Phone",
            dataIndex: "Phone",
            key: "Phone",
        },
        {   title: "Department",
            dataIndex: "Department",
            key: "Department",
        },
        { title: "Position",
            dataIndex: "Position",
            key: "Position",
        },
        { title: "Employment Status",
            dataIndex: "EmploymentStatus",
            key: "EmploymentStatus",
        },
        { title: "Date Hired",
            dataIndex: "DateHired",
            key: "DateHired",
            render: (date) => {
                if (!date) {
                    return "";
                }
                return date.substring(0, 10);
           }, },
        { title: "Actions",
            key: "actions",
            render: (_, employee) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => openEditModal(employee)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDeleteEmployee(employee.Id)}
                    > Delete
                    </Button>
                </Space>
            ),
        },
    ];
    // Report calculations
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
        (employee) =>
            employee.EmploymentStatus?.toLowerCase() === "active"
    ).length;
    const inactiveEmployees = employees.filter(
        (employee) =>
            employee.EmploymentStatus?.toLowerCase() !== "active"
    ).length;
    const departmentCounts = employees.reduce((result, employee) => {
        const department = employee.Department || "Unassigned";
        result[department] = (result[department] || 0) + 1;
        return result;
    }, {});
    // Login page
    if (!isLoggedIn) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f0f2f5",
                }}
            >
                <Card
                    title="Lloyd Employee Management System"
                    style={{ width: 400 }}
                >
                    <Form
                        form={loginForm}
                        layout="vertical"
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            label="Username"
                            name="Username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your username",
                                },
                            ]}
                        >
                            <Input placeholder="Enter username" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Login
                        </Button>
                    </Form>
                </Card>
            </div>
        );
    }
    // Employee management page
    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Lloyd Employee Management System"
                extra={
                    <Button danger onClick={handleLogout}>
                        Logout
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Employee
                    </Button>
                    <Button
                        onClick={() => setIsReportModalOpen(true)}
                    >
                        Employee Report
                    </Button>
                </Space>
                <Table
                    dataSource={employees}
                    columns={columns}
                    rowKey="Id"
                    scroll={{ x: 1500 }}
                />
            </Card>
            {/* Add Employee Modal */}
            <Modal
                title="Add Employee"
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    addForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={handleAddEmployee}
                >
                    <Form.Item label="Employee Number">
                        <Input
                            value="Automatically generated"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label="First Name"
                        name="FirstName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter first name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="LastName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter last name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter email",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone" name="Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Department" name="Department">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Position" name="Position">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Employment Status"
                        name="EmploymentStatus"
                    >
                        <Input placeholder="Active or Inactive" />
                    </Form.Item>
                    <Form.Item label="Date Hired" name="DateHired">
                        <Input type="date" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Save Employee
                    </Button>
                </Form>
            </Modal>
            {/* Edit Employee Modal */}
            <Modal
                title="Edit Employee"
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    editForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditEmployee}
                >
                    <Form.Item
                        label="Employee Number"
                        name="EmployeeNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="FirstName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter first name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="LastName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter last name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter email",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phone" name="Phone">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Department" name="Department">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Position" name="Position">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Employment Status"
                        name="EmploymentStatus"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Date Hired" name="DateHired">
                        <Input type="date" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Update Employee
                    </Button>
                </Form>
            </Modal>

            {}
            <Modal
                title="Employee Report"
                open={isReportModalOpen}
                onCancel={() => setIsReportModalOpen(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setIsReportModalOpen(false)}
                    >
                        Close
                    </Button>,
                ]}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            <Statistic
                                title="Total Employees"
                                value={totalEmployees}
                            />
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Active Employees"
                                value={activeEmployees}
                            />
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Inactive Employees"
                                value={inactiveEmployees}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
                    title="Employees per Department"
                    style={{ marginTop: 16 }}
                >
                    {Object.entries(departmentCounts).length === 0 ? (
                        <p>No department data available.</p>
                    ) : (
                        Object.entries(departmentCounts).map(
                            ([department, count]) => (
                                <p key={department}>
                                    <strong>{department}:</strong> {count} employee(s)
                                </p>
                            )
                        )
                    )}
                </Card>
            </Modal>
        </div>
    );
}

export default App;