import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { CreateSchool, GetSubscription } from "../../../../services/Index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetApplication } from "../../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../../redux/features/counter/adminSlice";
const { Option } = Select;

const AddClient = ({ showDrawer, onClose, open, handleRefresh }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([
    { name: "", email: "", password: "", role: "" },
  ]);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    gradeLevelsServed: "",
    schoolDistrict: "",
    schoolIdentificationNumber: "",
    schoolEmail: "",
    schoolPhoneNumber: "",
    subscriptionName: "",
    users: [],
  });
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    // Fetch subscriptions from API
    GetSubscription()
      .then((res) => {
        setSubscriptions(res);
      })
      .catch((err) => {
        let errRes = err.response.data;
        if (errRes.code === 401) {
          message.error(err.response.data.message);
          dispatch(resetApplication());
          dispatch(resetUserData());
          nav("/login");
        } else {
          message.error(err.response.data.message);
        }
      });
  }, []);

  const handleAddUser = () => {
    const newUser = { name: "", email: "", password: "", role: "" };
    setUsers([...users, newUser]);
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = users.filter((user, i) => i !== index);
    setUsers(updatedUsers);
  };

  const handleUserInputChange = (index, name, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][name] = value;
    setUsers(updatedUsers);
  };

  const handleSubmit = () => {
    const formDataToSend = {
      ...formData,
      users: users.map((user) => ({
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      })),
    };
    CreateSchool(formDataToSend)
      .then((res) => {
        console.log(res);
        if (res.code == 409) {
          message.error(res.message);
        } else {
          message.success("School Created Successfull!");

          setFormData({
            schoolName: "",
            schoolAddress: "",
            schoolType: "",
            gradeLevelsServed: "",
            schoolDistrict: "",
            schoolIdentificationNumber: "",
            schoolEmail: "",
            schoolPhoneNumber: "",
            subscriptionName: "",
            users: [],
          });
          handleRefresh();
          onClose();
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating client:", error);
        message.error("Error creating client");
      });
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "User Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveUser(index)}
          />
        </>
      ),
    },
  ];

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        New Client
      </Button>
      <Drawer
        title="Create Client"
        width={1000}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
        footer={
          <>
          <Row gutter={16} className="text-left"></Row>
          <div className="text-right p-2">
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
          </div>
          </>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolName"
                label="School Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter user schoolName",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter user schoolName"
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolEmail"
                label="School Email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please enter email",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) =>
                    handleInputChange("schoolEmail", e.target.value)
                  }
                  placeholder="Please enter email"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolType"
                label="School Type"
                rules={[
                  {
                    required: true,
                    message: "Please select an schoolType",
                  },
                ]}
              >
                <Select
                  placeholder="Please select an schoolType"
                  onChange={(value) => handleInputChange("schoolType", value)}
                >
                  <Option value="Public">Public</Option>
                  <Option value="Private">Private</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="subscriptionName"
                label="School Subscription Name"
                rules={[
                  {
                    required: true,
                    message: "Please select an subscriptionName",
                  },
                ]}
              >
                <Select
                  placeholder="Please select a subscriptionName"
                  onChange={(value) =>
                    handleInputChange("subscriptionName", value)
                  }
                >
                  {subscriptions.map((subscription) => (
                    <Option key={subscription._id} value={subscription.name}>
                      {subscription.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolPhoneNumber"
                label="School PhoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Please choose the School PhoneNumber",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) =>
                    handleInputChange("schoolPhoneNumber", e.target.value)
                  }
                  placeholder="Please enter Phone Number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolDistrict"
                label="School District"
                rules={[
                  {
                    required: true,
                    message: "Please choose the School District",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) =>
                    handleInputChange("schoolDistrict", e.target.value)
                  }
                  placeholder="Please enter District"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gradeLevelsServed"
                label="GradeLevel Served"
                rules={[
                  {
                    required: true,
                    message: "Please choose the gradeLevelsServed",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) =>
                    handleInputChange("gradeLevelsServed", e.target.value)
                  }
                  placeholder="Please enter gradeLevelsServed"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolIdentificationNumber"
                label="School IdentificationNumber"
                rules={[
                  {
                    required: true,
                    message: "Please choose the schoolIdentificationNumber",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) =>
                    handleInputChange(
                      "schoolIdentificationNumber",
                      e.target.value
                    )
                  }
                  placeholder="Please enter school Identification Number"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="schoolAddress"
                label="School Address"
                rules={[
                  {
                    required: true,
                    message: "please enter url schoolAddress",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  onChange={(e) =>
                    handleInputChange("schoolAddress", e.target.value)
                  }
                  placeholder="please enter url schoolAddress"
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" style={{ fontSize: "20px" }}>
            Users
          </Divider>
          {users &&
            users.map((user, index) => (
              <Row gutter={16} key={index}>
                <Col span={6}>
                  <Form.Item
                    label="Role"
                    name={`userrole${index}`}
                    rules={[
                      { required: true, message: "Please select a role" },
                    ]}
                  >
                    <Select
                      placeholder="Please select a role"
                      onChange={(value) =>
                        handleUserInputChange(index, "role", value)
                      }
                    >
                      <Option value="superadmin">Super Admin</Option>
                      <Option value="admin">Admin</Option>
                      <Option value="teacher">Teacher</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="User Name"
                    name={`username${index}`} // Unique name prop for each field
                    rules={[
                      { required: true, message: "Please enter user name" },
                    ]}
                  >
                    <Input
                      value={user.name}
                      onChange={(e) =>
                        handleUserInputChange(index, "name", e.target.value)
                      }
                      placeholder="User Name"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="User Email"
                    name={`useremail${index}`}
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                    ]}
                  >
                    <Input
                      value={user.email}
                      onChange={(e) =>
                        handleUserInputChange(index, "email", e.target.value)
                      }
                      placeholder="User Email"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Password"
                    name={`userpassword${index}`}
                    rules={[
                      { required: true, message: "Please enter password" },
                    ]}
                  >
                    <Input.Password
                      value={user.password}
                      onChange={(e) =>
                        handleUserInputChange(index, "password", e.target.value)
                      }
                      placeholder="Password"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          {users[0].name !== "" && (
            <Table columns={columns} dataSource={users} pagination={false} />
          )}

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add Row
          </Button>
        </Form>
      </Drawer>
    </>
  );
};
AddClient.propTypes = {
  showDrawer: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleRefresh: PropTypes.func,
};
export default AddClient;
