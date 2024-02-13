import {
  Button,
  Col,
  Input,
  InputNumber,
  Row,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import { useEffect } from "react";
import subjectOptions from "../../../../json/subject";

const Session = ({ session, setSession, setDisableFields }) => {
  const handleSession = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      session.name.length >= 5 &&
      session.grade.length >= 1 &&
      session.subject.length >= 1
    ) {
      setDisableFields(false);
    } else {
      setDisableFields(true);
    }
  }, [session]);
  return (
    <Row gutter={[16, 16]} className="py-3">
      <Col span={24}>
        <Typography>Experience Name</Typography>
        <Input
          name="name"
          value={session.name}
          placeholder="Please enter Experience name"
          onChange={handleSession}
        />
      </Col>
      <Col span={12}>
        <Typography>Grade</Typography>
        <InputNumber
          className="w-[100%]"
          name="grade"
          min={6}
          max={12}
          value={session.grade}
          onChange={(e) =>
            handleSession({ target: { value: e.toString(), name: "grade" } })
          }
        />
      </Col>
      <Col span={12}>
        <Typography>Subject</Typography>
        <Select
          defaultValue="Science"
          style={{
            width: "100%",
          }}
          name="subject"
          onChange={(e) =>
            handleSession({ target: { value: e, name: "subject" } })
          }
          options={subjectOptions}
        />
      </Col>
    </Row>
  );
};

export default Session;
