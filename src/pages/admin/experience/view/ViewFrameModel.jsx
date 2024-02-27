import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ViewFrameModel = () => {
  const Nav = useNavigate();
  const goBack = () => {
    Nav(-1);
  };

  return (
    <>
      <div className="text-start" style={{ height: "100vh" }}>
        <Card
          title={
            <div className="flex gap-3 items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                size="default"
                type="primary"
                onClick={() => goBack()}
              >
                Back
              </Button>
            </div>
          }
        >
          <div className="m-0 p-0" style={{ height: "calc(100vh - 53px)" }}>
            <iframe
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
