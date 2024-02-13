import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Row, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import ModelViewer from "../../../../components/modelViewer/ModelViewer";
import NotSupported from "../../../../assets/no-preview.gif";
import { useEffect, useState } from "react";
import { GetExperienceById } from "../../../../services/Index";

const ViewExperience = () => {
  const [data, setData] = useState(null);
  const params = useParams();

  useEffect(() => {
    GetExperienceById(params.id)
      .then((res) => {
        setData(res[0]);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  const handleDownload = (file, name) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = file;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const Nav = useNavigate();
  const goBack = () => {
    Nav(-1);
  };

  return (
    <>
      {data && (
        <Badge.Ribbon
          color={data.isDeployed ? "green" : "blue"}
          text={data.isDeployed ? "Deployed" : "Not Deployed"}
        >
          <div className="text-start">
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
                  {data.name}
                </div>
              }
            >
              <div className="grid gap-5 grid-cols-1">
                {data.content.map((cont, item) => (
                  <div key={item + 1} className="grid gap-5 grid-cols-1">
                    <Card type="inner" title="Character">
                      <Card>{cont.script}</Card>
                    </Card>
                    <Card type="inner" title="360 Video">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card>
                            <ReactPlayer
                              url={cont.image}
                              controls
                              width="100%"
                              height="auto"
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>{cont.imageScript}</Card>
                        </Col>
                      </Row>
                    </Card>
                    <Card type="inner" title="3D Model">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card>
                            <div className="flex flex-col gap-0 items-center h-96">
                              {cont.modelFormat == ".fbx" ? (
                                <img
                                  src={NotSupported}
                                  alt=""
                                  className="w-[40%]"
                                />
                              ) : (
                                <ModelViewer
                                  modelUrl={cont.model}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    focus: true,
                                  }}
                                />
                              )}
                              <Button
                                className="mt-5"
                                type="primary"
                                onClick={() =>
                                  handleDownload(cont.model, cont.modelName)
                                }
                              >
                                <DownloadOutlined /> Download
                              </Button>
                            </div>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>{cont.modelScript}</Card>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
                <Card type="inner" title="Assessment">
                  <div className="grid gap-5">
                    {data.assessment.map((ass, index) => (
                      <Card
                        key={index + 1}
                        type="inner"
                        title={`${index + 1}) ${ass.question}`}
                      >
                        <div className="grid gap-5 grid-cols-2">
                          {ass.options.map((option, ind) => (
                            <Card key={ind + 1} type="inner" size="small">
                              <div className="flex justify-between">
                                <p className="m-0">
                                  <b>
                                    {ind == 0
                                      ? "A"
                                      : ind == 1
                                      ? "B"
                                      : ind == 2
                                      ? "C"
                                      : "D"}
                                    ){" "}
                                  </b>
                                  {option.text}
                                </p>
                                {option.isCorrect ? (
                                  <CheckOutlined className="text-green-600 text-lg" />
                                ) : (
                                  ""
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        </Badge.Ribbon>
      )}
    </>
  );
};

export default ViewExperience;
