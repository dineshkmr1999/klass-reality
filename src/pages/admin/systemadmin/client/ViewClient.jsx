import React, { useEffect, useState } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import {
  CreateSchool,
  GetIdSchool,
  GetSubscription,
  PatchSchool,
} from "../../../../services/Index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetApplication } from "../../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../../redux/features/counter/adminSlice";
import DescriptionsItem from "antd/es/descriptions/Item";
import moment from "moment";
const { Option } = Select;

const ViewClient = ({ data, handleRefresh }) => {
  const [editopen, setEditopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const EditDrawer = () => {
    setEditopen(true);
  };
  const Close = () => {
    setEditopen(false);
  };
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    gradeLevelsServed: "",
    schoolDistrict: "",
    schoolIdentificationNumber: "",
    schoolEmail: "",
    schoolPhoneNumber: "",
    subscription: [
      {
        name: "",
        description: "",
        term: "",
        createdAt: "",
      },
    ],
    users: [],
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    // Fetch subscriptions from API

    if (data) {
      GetIdSchool(data.id)
        .then((res) => {
          console.log(res);
          setLoading(true);
          form.setFieldsValue({
            ...formData,
            schoolName: res[0].schoolName,
            schoolAddress: res[0].schoolAddress,
            schoolType: res[0].schoolType,
            gradeLevelsServed: res[0].gradeLevelsServed,
            schoolDistrict: res[0].schoolDistrict,
            schoolIdentificationNumber: res[0].schoolIdentificationNumber,
            schoolEmail: res[0].schoolEmail,
            schoolPhoneNumber: res[0].schoolPhoneNumber,
            subscription: res[0].subscritpions[0],
            users: res[0].users,
          });
          setFormData({
            ...formData,
            schoolName: res[0].schoolName,
            schoolAddress: res[0].schoolAddress,
            schoolType: res[0].schoolType,
            gradeLevelsServed: res[0].gradeLevelsServed,
            schoolDistrict: res[0].schoolDistrict,
            schoolIdentificationNumber: res[0].schoolIdentificationNumber,
            schoolEmail: res[0].schoolEmail,
            schoolPhoneNumber: res[0].schoolPhoneNumber,
            subscription: res[0].subscritpions[0],
            users: res[0].users,
          });
          setLoading(false);
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
    }
  }, [data]);

  const handleSubmit = () => {
    const formDataToSend = {
      ...formData,
    };
    PatchSchool(data.id, formDataToSend)
      .then(() => {
        message.success("Client created successfully");
        handleRefresh();
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating client:", error);
        message.error("Error creating client");
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email),
        render: (text, record) => (
          <a href={`mailto:${text}`} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ),
      },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
  ];
  return (
    <>
      <Button type="primary" onClick={EditDrawer} icon={<EyeOutlined />} />
      <Drawer
        title={formData.schoolName}
        width={1000}
        onClose={Close}
        open={editopen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={Close}>Close</Button>
          </Space>
        }
      >
        <Row className="mb-10">
          <Col xs="24" sm="24" md="24" lg="24">
            <Divider style={{ fontSize: "20px" }}>Client Details</Divider>
            <Descriptions title="" layout="vertical">
              <Descriptions.Item
                label="School Name"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolName}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Email"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolEmail}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Type"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolType}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Phonenumber"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Grade Levels Served"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.gradeLevelsServed}
              </Descriptions.Item>
              <Descriptions.Item
                label="School District"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolDistrict}
              </Descriptions.Item>
              <Descriptions.Item
                label="school Identification Number"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolIdentificationNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Address"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolAddress}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Row className="mb-5 mt-5">
          <Col xs="24" sm="24" md="24" lg="24">
            <Divider style={{ fontSize: "20px" }}>Subscription Details</Divider>
            <Descriptions title="" layout="vertical">
              <Descriptions.Item
                label="School Name"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.subscription.name}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Term"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.subscription.term}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Created Date"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {moment(formData.subscription.createdAt).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="School Description"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.subscription.description}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider style={{ fontSize: "20px" }}>Users Details</Divider>
        <Table
          loading={loading}
          className="mt-7"
          columns={columns}
          dataSource={formData.users}
        />
      </Drawer>
    </>
  );
};

ViewClient.propTypes = {
  data: PropTypes.object,
  handleRefresh: PropTypes.func,
};

export default ViewClient;
