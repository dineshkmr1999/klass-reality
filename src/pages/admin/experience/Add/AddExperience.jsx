import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Steps, message, theme } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Session from "./Session";
import {
  CreateAssessments,
  CreateContent,
  CreateSession,
  DeleteSession,
  PatchContent,
} from "../../../../services/Index";
import {
  assessmentData as AssessmentData,
  resetApplication,
} from "../../../../redux/features/counter/applicationSlice";
import Character from "./Character";
import Model3D from "./Model3D";
import Video360 from "./Video360";
import Assessment from "./Assessment";
import ApplicationModal from "../../../../redux/json/ApplicationModal";

const AddExperience = ({ open, showModal, onClose, handleRefresh }) => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state) => state.application.session);
  const contentData = useSelector((state) => state.application.contentData);
 
  const assessmentData = useSelector(
    (state) => state.application.assessmentData
  );
  const [session, setSession] = useState(sessionData);
  const [content, setContent] = useState(contentData);
  const [assessment, setAssessment] = useState(assessmentData);
  const [formLoader, setFormLoader] = useState(false);
  const [disableFields, setDisableFields] = useState(false);
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const Prev = () => {
    setCurrent(current - 1);
  };

  const { sessionModal, assessmentModal, contentModal } = ApplicationModal();

  const resetStatesToDefault = () => {
    // Define your initial/default values for each state
    const initialSessionData = sessionModal;
    const initialContentData = contentModal;
    const initialAssessmentData = assessmentModal;
    const initialFormLoader = false;
    const initialDisableFields = false;
    const initialCurrent = 0;

    // Reset the states to their default values
    setSession(initialSessionData);
    setContent(initialContentData);
    setAssessment(initialAssessmentData);
    setFormLoader(initialFormLoader);
    setDisableFields(initialDisableFields);
    setCurrent(initialCurrent);
  };

  const handleClose = (id) => {
    if (id) {
      DeleteSession(id)
        .then((res) => {
          onClose();
          resetStatesToDefault();
          handleRefresh();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      onClose();
    }
  };

  const next = () => {
    if (current == 0) {
      if (!("id" in session)) {
        setFormLoader(true);
        CreateSession(session)
          .then((res) => {
            const duplicateContent = { ...contentData };
            setSession(res);
            setContent({ ...duplicateContent, sessionId: res.id });
            setFormLoader(false);
            setCurrent(current + 1);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrent(current + 1);
      }
    }
    if (current == 1) {
      setFormLoader(true);
      const formData = new FormData();
      formData.append("sessionId", content.sessionId);
      formData.append("script", content.script);
      CreateContent(formData)
        .then((res) => {
          const duplicateObject = { ...content };
          setContent({ ...duplicateObject, id: res._id });
          setFormLoader(false);
          setCurrent(current + 1);
        })
        .catch((err) => {
          setFormLoader(false);
          console.log(err);
        });
    }
    if (current == 2) {
      setFormLoader(true);
      const formData = new FormData();
      formData.append("sessionId", content.sessionId);
      formData.append("image", content.image);
      formData.append("imageScript", content.imageScript);
      PatchContent(content.id, formData)
        .then((res) => {
          const duplicateObject = { ...content };
          const duplicateAssessment = structuredClone(assessmentData);
          setContent({ ...duplicateObject });
          duplicateAssessment[0].sessionId = res.sessionId;
          dispatch(AssessmentData(duplicateAssessment));
          setAssessment(duplicateAssessment);
          setFormLoader(false);
          setCurrent(current + 1);
        })
        .catch((err) => {
          setFormLoader(false);
          console.log(err);
        });
    }
    if (current == 3) {
      setFormLoader(true);
      const formData = new FormData();
      formData.append("sessionId", content.sessionId);
      formData.append("model", content.model);
      formData.append("modelScript", content.modelScript);
      PatchContent(content.id, formData)
        .then((res) => {
          const duplicateObject = { ...content };
          setContent({ ...duplicateObject });
          setFormLoader(false);
          setCurrent(current + 1);
        })
        .catch((err) => {
          setFormLoader(false);
          console.log(err);
        });
    }

    if (current == 4) {
      setFormLoader(true);
      CreateAssessments(assessment)
        .then((res) => {
          message.success("Experience Created successfully");
          dispatch(resetApplication());
          setSession(sessionData);
          setContent(contentData);
          setAssessment(assessmentData);
          setCurrent(0);
          setFormLoader(false);
          handleRefresh();
          onClose();
        })
        .catch((err) => {
          setFormLoader(false);
          console.log(err);
        });
    }
  };

  const skip = () => {
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: "Experience",
      content: (
        <Session
          session={session}
          setSession={setSession}
          setDisableFields={setDisableFields}
        />
      ),
    },
    {
      title: "Character",
      content: (
        <Character
          content={content}
          setContent={setContent}
          setDisableFields={setDisableFields}
        />
      ),
    },
    {
      title: "360 Video",
      content: (
        <Video360
          content={content}
          setContent={setContent}
          setDisableFields={setDisableFields}
        />
      ),
    },
    {
      title: "3D Model",
      content: (
        <Model3D
          content={content}
          setContent={setContent}
          setDisableFields={setDisableFields}
        />
      ),
    },

    {
      title: "Assessment",
      content: (
        <Assessment
          assessment={assessment}
          setAssessment={setAssessment}
          assessmentData={assessmentData}
          setDisableFields={setDisableFields}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 12,
  };

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Add Experience
      </Button>
      <Modal
        width={1000}
        title={`Create Experience ${
          current > 0 ? "( " + session.name + " )" : ""
        } `}
        open={open}
        closable
        onCancel={() => handleClose(session?.id)}
        footer={false}
      >
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div
          className="flex justify-end items-center gap-4"
          style={{
            marginTop: 24,
          }}
        >
          <Button onClick={() => Prev()} disabled={current == 0}>
            Back
          </Button>
          {current < steps.length - 1 && (
            <>
              {current > 0 && ( // Conditional rendering of the Skip button for steps beyond the first one
                <Button onClick={skip}>
                  Skip
                </Button>
              )}
              <Button
                type="primary"
                onClick={() => next()}
                disabled={disableFields}
                loading={formLoader}
              >
                Next
              </Button>
            </>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => next()}
              disabled={false}
              loading={formLoader}
            >
              Submit
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};
AddExperience.propTypes = {
  open: PropTypes.bool,
  showModal: PropTypes.func,
  onClose: PropTypes.func,
  handleRefresh: PropTypes.func,
};
export default AddExperience;
