import  { useState, useEffect } from "react";
import { Divider, Table, Checkbox, Row, Col, message } from "antd";
import { GetRoles, patchRoles } from "../../../../services/Index";
import { resetApplication } from "../../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../../redux/features/counter/adminSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    GetRoles()
      .then((res) => {
        setRoles(
          res.map((item) => ({
            ...item,
            key: item._id,
          }))
        );
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
          setLoading(false);
        }
      });
  }, []);

  const handleCheckboxChange = (roleId, permission, checked) => {
    const updatedRoles = roles.map((role) => {
      if (role._id === roleId) {
        if (checked) {
          role.permissions.push(permission);
        } else {
          role.permissions = role.permissions.filter(
            (p) => p !== permission
          );
        }
      }
      return role;
    });
    setRoles(updatedRoles);

    if (checked) {
      patchRoles(roleId, { permissions: [permission] });
    } else {
      patchRoles(roleId, { permissions: [] });
    }
  };

  const columns = [
    {
      title: "Roles",
      dataIndex: "role",
      key: "role",
      width: "40%",
    },
    {
      title: "Permission",
      dataIndex: "permissions",
      render: (_, record) => (
        <Row gutter={[12, 12]}>
          {record.permissions.map((permission) => (
            <Col key={permission} span={8}>
              <Checkbox
                value={permission}
                onChange={(e) =>
                  handleCheckboxChange(record._id, permission, e.target.checked)
                }
              >
                {permission}
              </Checkbox>
            </Col>
          ))}
        </Row>
      ),
      key: "permission",
      width: "60%",
    },
  ];

  return (
    <>
      <Divider orientation="left" style={{fontSize: "20px"}}>Roles & Permissions</Divider>
      <Table
        columns={columns}
        loading={loading}
        dataSource={roles}
        style={{
          marginTop: 24,
        }}
      />
    </>
  );
};

export default Roles;
