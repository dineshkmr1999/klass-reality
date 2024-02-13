import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Table, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";

const ExperienceTable = ({
  data,
  loading,
  handleDelete,
  handleView,
  setSelectedValue,
  selectedValue,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Status",
      key: "isDeployed",
      align: "center",
      filters: [
        {
          text: "Not Deployed",
          value: false,
        },
        {
          text: "Deployed",
          value: true,
        },
      ],
      onFilter: (value, record) => record.isDeployed === value,
      render: (text, record) => (
        <Tag
          color={`${record.isDeployed ? "green" : "blue"}`}
          className="px-5 py-1 capitalize  "
        >
          {record.isDeployed ? "Deployed" : "Not Deployed"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "id",
      align: "center",
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip placement="top" title="View Experience">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
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
  const rowSelection = {
    selectedRowKeys: [selectedValue],
    onChange: (selectedRowKeys) => {
      setSelectedValue(selectedRowKeys[0]);
    },
  };
  return (
    <Table
      loading={loading}
      className="mt-7"
      rowSelection={{
        type: "radio",
        ...rowSelection,
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

ExperienceTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
};

export default ExperienceTable;
