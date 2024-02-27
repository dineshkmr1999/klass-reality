import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, Upload, Slider } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState, useEffect } from "react";

const Video360 = ({ content, setContent, setDisableFields }) => {
  const [videoDuration, setVideoDuration] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prevContent) => ({ ...prevContent, [name]: value }));
  };

  const handleFile = (file) => {
    setContent((prevContent) => ({ ...prevContent, image: file }));
    setVideoPreviewUrl(URL.createObjectURL(file));
    setStartTime(0);
    setEndTime(null);
  };

  const handleRemove = () => {
    setContent((prevContent) => ({ ...prevContent, image: "" }));
    setVideoPreviewUrl(null);
    setVideoDuration(null);
    setStartTime(0);
    setEndTime(null);
  };

  const handleTrim = () => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(content.image);

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const trimStart = (startTime / video.duration) * video.videoWidth;
      const trimEnd = (endTime / video.duration) * video.videoWidth;
      const trimWidth = trimEnd - trimStart;

      canvas.width = trimWidth;
      canvas.height = video.videoHeight;

      context.drawImage(
        video,
        trimStart,
        0,
        trimWidth,
        video.videoHeight,
        0,
        0,
        trimWidth,
        video.videoHeight
      );

      canvas.toBlob((blob) => {
        setVideoPreviewUrl(URL.createObjectURL(blob));
        setVideoDuration(endTime - startTime);
      }, "video/mp4");
    };
  };

  useEffect(() => {
    if (content.image && content.image.type.includes("video/")) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(content.image);
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        setEndTime(video.duration);
      };
    }
    if (content.image && content.imageScript.length > 5) {
      setDisableFields(false);
    } else {
      setDisableFields(true);
    }
  }, [content, setContent]);

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };

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
          fileList={content.image ? [content.image] : []}
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
          autoSize={{ minRows: 12, maxRows: 12 }}
        />
      </Col>
      {videoDuration && (
        <>
          <Col span={24}>
            <Typography>Video Duration:</Typography>
            <p>{formatDuration(videoDuration)}</p>
          </Col>
          <Col span={24}>
            <Typography>Trim Video:</Typography>
            <Slider
              min={0}
              max={videoDuration}
              step={0.1}
              value={[startTime, endTime]}
              onChange={(value) => {
                setStartTime(value[0]);
                setEndTime(value[1]);
              }}
              range
            />
          </Col>
          <Col span={24}>
            <Button type="primary" onClick={handleTrim}>
              Trim Video
            </Button>
          </Col>
        </>
      )}
      {videoPreviewUrl && (
        <Col span={24}>
          <Typography>Trimmed Video Preview:</Typography>
          <video controls style={{ width: "100%" }}>
            <source src={videoPreviewUrl} type="video/mp4" />
          </video>
        </Col>
      )}
    </Row>
  );
};

export default Video360;
