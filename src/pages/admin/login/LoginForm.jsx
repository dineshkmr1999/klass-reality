import { Button, Form, Input, message } from "antd";
import { UserLogin } from "../../../services/Index";
import { useLocalStorage } from "../../../redux/useLocalStorage";
import { useDispatch } from "react-redux";
import {
  accessToken,
  refreshToken,
  user,
} from "../../../redux/features/counter/adminSlice";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const LoginForm = () => {
  const nav = useNavigate();

  const [, setAccessToken] = useLocalStorage("accessToken", null);
  const [, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [, setUserData] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // navigator.geolocation.getCurrentPosition(
    // (position) => {
    // const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    setLoading(true);
    const loginValues = {
      ...values,
    };

    UserLogin(loginValues)
      .then((res) => {
        setAccessToken(res.tokens.access.token);
        dispatch(accessToken(res.tokens.access.token));

        setRefreshToken(res.tokens.refresh.token);
        dispatch(refreshToken(res.tokens.refresh.token));

        setUserData(res.user);
        dispatch(user(res.user));
        message.success("Successfully logged in");
        if (res.user.role == "systemadmin") {
          nav("/dashboard");
        } else if (res.user.role == "teacher") {
          nav("/experience");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error('Incorrect email or password')
        console.log(err);
      });
    // },
    (error) => {
      console.error(error.message);
    };
    // );
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      wrapperCol={{
        span: 24,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="mt-8"
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon p-3" />}
          placeholder="user@example.com"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password
          placeholder="password"
          prefix={<LockOutlined className="site-form-item-icon p-3" />}
        />
      </Form.Item>

      <Form.Item>
        <Button
          className="w-full text-base font-semibold mt-5"
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
