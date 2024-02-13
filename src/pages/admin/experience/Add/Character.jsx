import { Col, Row, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import  { useEffect } from "react";

const Character = ({content, setContent, setDisableFields}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    const duplicateObject = { ...content };
    setContent({ ...duplicateObject, [name]: value });
  };

  useEffect(() => {
    if (content.script.length > 5) {
      setDisableFields(false);
    } else {
      setDisableFields(true);
    }
  }, [content]);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Typography>Script</Typography>
        <TextArea
        name="script"
        value={content.script}
        onChange={handleChange}
          placeholder="Please enter your character script"
          autoSize={{
            minRows: 12,
            maxRows: 12,
          }}
        />
      </Col>
    </Row>
  );
};

export default Character;
