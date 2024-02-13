import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import  { useEffect } from "react";

const Model3D = ({ content, setContent, setDisableFields }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const duplicateObject = { ...content };
    setContent({ ...duplicateObject, [name]: value });
  };
  const handleFile = (file) => {
    const duplicateObject = { ...content };
    duplicateObject.model = file;
    setContent(duplicateObject);
  };

  const handleRemove = () => {
    setContent((prev) => ({
      ...prev,
      model: "",
    }));
  };

  useEffect(() => {
    if (content.model != "" && content.modelScript.length > 5) {
      setDisableFields(false);
    } else {
      setDisableFields(true);
    }
  }, [content]);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Upload
          name="model"
          listType="picture"
          beforeUpload={(file) => {
            handleFile(file);
            return false;
          }}
          accept=".fbx,.glb,.gltf"
          maxCount={1}
          onRemove={handleRemove}
          fileList={content?.model == "" ? [] : [content?.model]}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Col>
      <Col span={24}>
        <Typography>Script</Typography>
        <TextArea
          name="modelScript"
          value={content.modelScript}
          onChange={handleChange}
          placeholder="Please enter your Model script"
          autoSize={{
            minRows: 12,
            maxRows: 12,
          }}
        />
      </Col>
    </Row>
  );
};

export default Model3D;
