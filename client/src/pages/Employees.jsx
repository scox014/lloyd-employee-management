import { Table, Button, Space, Typography } from "antd";

const { Title } = Typography;

function Employees() {
    const columns = [
        {
            title: "Employee Number",
            dataIndex: "employeeNumber",
            key: "employeeNumber",
        },
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space>
                    <Button type="primary">Edit</Button>
                    <Button danger>Delete</Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: "1",
            employeeNumber: "EMP-001",
            firstName: "Juan",
            lastName: "Dela Cruz",
            department: "IT",
            position: "Junior Programmer",
        },
    ];

    return (
        <div>
            <Title level={2}>Employee Management</Title>

            <Button type="primary" style={{ marginBottom: 16 }}>
                Add Employee
            </Button>

            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default Employees;