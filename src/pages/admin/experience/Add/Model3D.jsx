import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, Upload, Space } from "antd"; // Import Space component
import TextArea from "antd/es/input/TextArea";
import { useState, useEffect } from "react";

const Model3D = ({ initialContent, setContent, setDisableFields }) => {
  const [contentData, setContentData] = useState(initialContent || []);
  const [scriptData, setScriptData] = useState(
    Array(contentData.length).fill("")
  );

  const handleFile = (file, index) => {
    const updatedContent = [...contentData];
    updatedContent[index] = { ...updatedContent[index], model: file };
    setContentData(updatedContent);
  };

  const handleRemove = (index) => {
    const updatedContent = [...contentData];
    updatedContent.splice(index, 1);
    setContentData(updatedContent);
    const updatedScriptData = [...scriptData];
    updatedScriptData.splice(index, 1);
    setScriptData(updatedScriptData);
  };

  useEffect(() => {
    console.log(scriptData);
    console.log(contentData);
    if (contentData.every((item) => item.model && scriptData.length > 5)) {
      setDisableFields(true); // Enable the next button if all conditions are met
    } else {
      setDisableFields(false); // Disable the next button if any condition is not met
    }
  }, [contentData, scriptData, setDisableFields]);

  const handleEdit = (e, index) => {
    const updatedScriptData = [...scriptData];
    updatedScriptData[index] = e.target.value;
    setScriptData(updatedScriptData);
  };

  // Render one default row if contentData is empty
  if (contentData.length === 0) {
    return (
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Upload
            name={`model-0`}
            listType="picture"
            beforeUpload={(file) => {
              handleFile(file, 0);
              return false;
            }}
            accept=".fbx,.glb,.gltf"
            maxCount={1}
            onRemove={() => handleRemove(0)}
            fileList={[]}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Col>
        <Col span={24}>
          <Typography>Script</Typography>
          <TextArea
            name={`modelScript-0`}
            value={scriptData[0] || ""}
            onChange={(e) => handleEdit(e, 0)}
            placeholder="Please enter your Model script"
            autoSize={{ minRows: 12, maxRows: 12 }}
          />
        </Col>
      </Row>
    );
  }

  return (
    <>
      {contentData.map((item, index) => (
        <Row key={index} gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Upload
              name={`model-${index}`}
              listType="picture"
              beforeUpload={(file) => {
                handleFile(file, index);
                return false;
              }}
              accept=".fbx,.glb,.gltf"
              maxCount={1}
              onRemove={() => handleRemove(index)}
              fileList={item.model ? [item.model] : []}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Col>
          <Col span={24}>
            <Typography>Script</Typography>
            <TextArea
              name={`modelScript-${index}`}
              value={scriptData[index] || ""}
              onChange={(e) => handleEdit(e, index)}
              placeholder="Please enter your Model script"
              autoSize={{ minRows: 12, maxRows: 12 }}
            />
          </Col>
          <Col span={24}>
            <Space
              align="center"
              style={{ width: "100%", paddingTop: "12px" }}
              justify="space-between"
            >
              <Button type="primary" danger onClick={() => handleRemove(index)}>
                Delete
              </Button>
              {contentData.length < 3 && (
                <Button
                  onClick={() =>
                    setContentData([
                      ...contentData,
                      { model: null, modelScript: "" },
                    ])
                  }
                >
                  Add
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default Model3D;
