import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

const Video360 = ({ content, setContent, setDisableFields }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const duplicateObject = { ...content };
    setContent({ ...duplicateObject, [name]: value });
  };
  const handleFile = (file) => {
    const duplicateObject = { ...content };
    duplicateObject.image = file;
    setContent(duplicateObject);
  };

  const handleRemove = () => {
    setContent((prev) => ({
      ...prev,
      image: "",
    }));
  };

  useEffect(() => {
    if (content.image != "" && content.imageScript.length > 5) {
      setDisableFields(false);
    } else {
      setDisableFields(true);
    }
  }, [content]);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Upload
          name="image"
          listType="picture"
          beforeUpload={(file) => {
            handleFile(file);
            return false;
          }}
          maxCount={1}
          accept=".mp4,.mov,.mkv,.avi"
          onRemove={handleRemove}
          fileList={content?.image == "" ? [] : [content?.image]}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Col>
      <Col span={24}>
        <Typography>Script</Typography>
        <TextArea
          name="imageScript"
          value={content.imageScript}
          onChange={handleChange}
          placeholder="Please enter your Video script"
          autoSize={{
            minRows: 12,
            maxRows: 12,
          }}
        />
      </Col>
    </Row>
  );
};

export default Video360;
