import {
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  PicLeftOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Dropdown, Layout, Menu, message, theme } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../redux/features/counter/adminSlice";
const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const Roles = useSelector((state) => state.admin.user.role);
  console.log(Roles);
  const location = useLocation();
  const [active] = useState(location.pathname.replace("/", ""));
  const User = useSelector((state) => state.admin.user);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleAvatarClick = (e) => {
    if (e.key === "logout") {
      message.success("Successfully logged out");
      dispatch(resetApplication());
      dispatch(resetUserData());
      nav("/login");
    }
    setVisible(false);
  };

  const AvatarMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: User.email,
    },
    {
      key: "divider",
      label: <Divider className="m-0" />,
    },
    {
      key: "logout",
      label: (
        <div className="flex gap-2 items-center text-red-500">
          <LogoutOutlined /> <span>Log out</span>
        </div>
      ),
    },
  ];

  const getMenuItems = () => {
    if (Roles === "teacher") {
      return [
        {
          key: "experience",
          icon: <PicLeftOutlined />,
          label: <Link to={"/experience"}>View Experience</Link>,
        },
      ];
    } else if (Roles === "systemadmin") {
      return [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to={"/dashboard"}>Dashboard</Link>,
        },
        {
          key: "client",
          icon: <UserOutlined />,
          label: <Link to={"/client"}>Client</Link>,
        },
        {
          key: "subscription",
          icon: <DollarOutlined />,
          label: <Link to={"/subscription"}>Subscription</Link>,
        },
        {
          key: "roles",
          icon: <UsergroupAddOutlined />,
          label: <Link to={"/roles"}>Roles</Link>,
        },
      ];
    }
  };
  return (
    <Layout hasSider>
      <Sider
        theme="dark"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="px-3 py-1 my-2 mx-1">
          <p className="text-base py-2 text-gray-50 bg-gray-700 rounded m-0 text-center">
            Klass Reality
          </p>
          {/* <img src="" alt="" /> */}
        </div>
       
        <Menu theme="dark" mode="inline" style={{ fontSize: "16px" }} defaultSelectedKeys={[active]}>
          {getMenuItems().map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
          height: "100%",
          minHeight: "100vh",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#fff",
          }}
          className="flex justify-end px-4 items-center"
        >
          <Dropdown
            overlay={
              <Menu onClick={handleAvatarClick} items={AvatarMenuItems} />
            }
            trigger={["click"]}
            open={visible}
            onOpenChange={(flag) => setVisible(flag)}
          >
            <Avatar
              style={{
                backgroundColor: "gray",
                verticalAlign: "middle",
              }}
              size="large"
              gap={2}
              className="cursor-pointer"
            >
              {User.name}
            </Avatar>
          </Dropdown>
        </Header>
        <Content
          className="layout-bg"
          style={{
            padding: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              borderRadius: borderRadiusLG,
              background: "rgba(255, 255, 255, 0.83)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
