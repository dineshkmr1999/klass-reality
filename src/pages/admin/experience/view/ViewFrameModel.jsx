import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ViewFrameModel = () => {
  const Nav = useNavigate();
  const iframeRef = useRef(null);

  const goBack = () => {
    Nav(-1);
  };

  useEffect(() => {
  const setIframeStyles = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const canvasElement = iframeDocument.getElementById("unity-container");
        if (canvasElement) {
          canvasElement.style.width = "100%";
          canvasElement.style.height = "100%";
        }
      }
    }
  };

  if (iframeRef.current) {
    iframeRef.current.addEventListener("load", setIframeStyles);
  }

  return () => {
    if (iframeRef.current) {
      iframeRef.current.removeEventListener("load", setIframeStyles);
    }
  };
}, []);

  return (
    <>
      <div className="text-start">
        <Card
          title={
            <div className="flex gap-3 items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                size="default"
                type="primary"
                onClick={goBack}
              >
                Back
              </Button>
            </div>
          }
        >
          <div className="m-0 p-0 canvas-container" style={{ height: "calc(100vh - 53px)" }}>
            <iframe
              ref={iframeRef}
              src="https://klass-vr-annotation.s3.amazonaws.com/index.html"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="iframe content"
            ></iframe>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ViewFrameModel;
