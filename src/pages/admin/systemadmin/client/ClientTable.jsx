import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Popconfirm,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import PropTypes from "prop-types";
import { PatchSchool } from "../../../../services/Index";
import EditClient from "./EditClient";
import ViewClient from "./ViewClient";

const ClientTable = ({
  data,
  loading,
  handleDelete,
  handleRefresh,
}) => {
  const handleStatus = (record, checked) => {
    const data = {
      isActive: checked,
    };
    PatchSchool(record.id, data)
      .then(() => {
        message.success("School updated successfully!");
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
        // Optionally, handle errors if the patch request fails
      });
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "schoolName",
      key: "schoolName",
      sorter: (a, b) => a.schoolName.localeCompare(b.schoolName),
    },
    {
      title: "Email",
      dataIndex: "schoolEmail",
      key: "schoolEmail",
      sorter: (a, b) => a.schoolEmail.localeCompare(b.schoolEmail),
    },
    {
      title: "PhoneNumber",
      dataIndex: "schoolPhoneNumber",
      key: "schoolPhoneNumber",
      sorter: (a, b) => a.schoolPhoneNumber.localeCompare(b.schoolPhoneNumber),
    },
    {
      title: "Address",
      dataIndex: "schoolAddress",
      key: "schoolAddress",
      sorter: (a, b) => a.schoolAddress.localeCompare(b.schoolAddress),
    },
    {
      title: "Type",
      dataIndex: "schoolType",
      key: "schoolType",
      sorter: (a, b) => a.schoolType.localeCompare(b.schoolType),
    },
    {
      title: "Subscription Remaining Days",
      dataIndex: "subscriptionRemainingDays",
      key: "subscriptionRemainingDays",
      sorter: (a, b) =>
        b.subscriptionRemainingDays - a.subscriptionRemainingDays,
    },

    {
      title: "Status",
      key: "isActive",
      align: "center",
      render: (text, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleStatus(record, checked)}
        />
      ),
    },
    {
      title: "Action",
      key: "id",
      align: "center",
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip placement="top" title="View">
          
             <ViewClient
              data={record}
              handleRefresh={handleRefresh}
            />
          </Tooltip>
          <Tooltip placement="top" title="Edit">
            <EditClient
              data={record}
              handleRefresh={handleRefresh}
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Delete the Experience"
              description="Are you sure to delete this Experience?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      className="mt-7"
      columns={columns}
      dataSource={data}
    />
  );
};
ClientTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};
export default ClientTable;
