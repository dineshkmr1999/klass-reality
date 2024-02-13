import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  DeleteSession,
  DeploySession,
  GetAllExperience,
} from "../../../services/Index";
import ExperienceTable from "./ExperienceTable";
import AddExperience from "./Add/AddExperience";
import { useDispatch } from "react-redux";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { useNavigate } from "react-router-dom";
import { resetUserData } from "../../../redux/features/counter/adminSlice";
import { SendOutlined } from "@ant-design/icons";
import subjectOptions from "../../../json/subject";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [searchValue, setSearchValue] = useState({
    grade: "",
    subject: "",
  });
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deployModal, setDeployModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    DeleteSession(id)
      .then(() => {
        message.success("Deleted Successfully!");
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;

    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleDeploy = () => {
    DeploySession(selectedValue)
      .then(() => {
        message.success("Deployed Successfully!");
        setSelectedValue(null);
        setDeployModal(false);
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleView = (id) => {
    nav(`/experience/${id}`);
  };

  useEffect(() => {
    GetAllExperience(searchValue)
      .then((res) => {
        // Filter items with isDeployed === true
        const deployedItems = res.filter((item) => item.isDeployed === true);
        // Filter items with isDeployed === false
        const nonDeployedItems = res.filter((item) => item.isDeployed !== true);
        // Concatenate deployedItems and nonDeployedItems arrays
        const sortedExperience = deployedItems.concat(nonDeployedItems);

        setExperience(
          sortedExperience.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );

        setLoading(false);
      })
      .catch((err) => {
        let errRes = err.response.data;
        if (errRes.code == 401) {
          message.error(err.response.data.message);
          dispatch(resetApplication());
          dispatch(resetUserData());
          nav("/login");
        } else {
          message.error(err.response.data.message);
          setLoading(false);
        }
      });
  }, [refresh, searchValue]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <span className="text-xl m-0">View Experience</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left">
          <Col span={12}>
            <Input
              placeholder="Enter Grade"
              className="min-w-72"
              value={searchValue.grade}
              name="grade"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
          <Col span={12}>
            <Select
              showSearch
              placeholder="Select a Subject"
              allowClear
              className="min-w-72"
              onChange={(e) =>
                handleSearch({ target: { value: e, name: "subject" } })
              }
              options={subjectOptions}
            />
          </Col>
        </Row>
        <div className="flex gap-4">
          <Tooltip placement="top" title="Deploy Experience">
            {/* <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleDeploy()}
              ghost
              loading={deployLoader}
              disabled={!selectedValue}
            >
              Deploy
            </Button> */}
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={!selectedValue}
              onClick={() => setDeployModal(true)}
            >
              Deploy
            </Button>
          </Tooltip>
          <Modal
            title="Do you want to deploy?"
            open={deployModal}
            onOk={handleDeploy}
            onCancel={() => {
              setDeployModal(false), setSelectedValue(null);
            }}
            okText="Ok"
            cancelText="Cancel"
          >
            {/* <p>Active Device Count: </p>
            <p>Experience Name: </p> */}
          </Modal>
          <Tooltip placement="top" title="Add Experience">
            <AddExperience
              open={open}
              onClose={onClose}
              showModal={showModal}
              handleRefresh={handleRefresh}
            />
          </Tooltip>
        </div>
      </div>
      <ExperienceTable
        data={experience}
        handleRefresh={handleRefresh}
        loading={loading}
        handleDelete={handleDelete}
        handleDeploy={handleDeploy}
        handleView={handleView}
        setSelectedValue={setSelectedValue}
        selectedValue={selectedValue}
      />
    </div>
  );
};

export default Experience;
