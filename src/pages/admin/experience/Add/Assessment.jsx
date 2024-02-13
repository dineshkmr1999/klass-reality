import { Button, Card, Col, Flex, Input, Row, Switch, Typography } from "antd";
import { useEffect } from "react";

const Assessment = ({
  assessment,
  setAssessment,
  assessmentData,
  setDisableFields,
}) => {
  const createNewQuestion = () => {
    return {
      question: "",
      options: [
        {
          text: "",
          isCorrect: true,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
      ],
      sessionId: assessmentData[0].sessionId,
    };
  };
  useEffect(() => {
    const isAllValid = assessment.every((item) => {
      const isQuestionValid =
        item.question.trim() !== "" && item.question.length > 5;
      const isCorrectValid = item.options.some((ans) => ans.isCorrect);
      const isTextValid = item.options.every((ans) => ans.text.trim() !== "");
      return isQuestionValid && isTextValid && isCorrectValid;
    });

    setDisableFields(!isAllValid);
  }, [assessment]);

  const handleChange = (e, index, ansIndex) => {
    const { name, value } = e.target;
    const duplicateArray = structuredClone(assessment);
    if (name === "question") {
      duplicateArray[index][name] = value;
    } else {
      duplicateArray[index].options[ansIndex].text = value;
    }
    setAssessment(duplicateArray);
  };

  const handleSwitch = (e, index, ansIndex) => {
    const value = e;
    const duplicateArray = structuredClone(assessment);
    if (value === true) {
      duplicateArray[index].options.forEach((option, i) => {
        if (i !== ansIndex) {
          duplicateArray[index].options[i].isCorrect = !value;
        }
      });
    }
    duplicateArray[index].options[ansIndex].isCorrect = value;
    setAssessment(duplicateArray);
  };

  const AddNewQuestion = () => {
    const duplicateQuestion = createNewQuestion();
    setAssessment([...assessment, duplicateQuestion]);
  };

  const handleDelete = () => {
    if (assessment.length > 1) {
      const updatedAssessment = assessment.slice(0, assessment.length - 1);
      setAssessment(updatedAssessment);
    }
  };
  return (
    <Row gutter={16} style={{gap:'1rem'}}>
      <Col span={24}>
        {assessment.map((asses, index) => (
          <Card size="small" key={index} className="my-2">
            <Typography>MCQ {index + 1}:</Typography>
            <Input
              name="question"
              value={asses.question}
              placeholder="Enter the question ?"
              onChange={(e) => handleChange(e, index)}
              variant="borderless"
            />
            <Row gutter={16}>
              {asses.options.map((ans, i) => (
                <Col span={12} key={i + 1}>
                  <Flex gap="small" align="center" justify="center">
                    <p>{i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : "D"}:</p>
                    <Input
                      name="text"
                      value={ans.text}
                      placeholder="Enter the Answer"
                      onChange={(e) => handleChange(e, index, i)}
                      variant="filled"
                    />
                    <Switch
                      name="isCorrect"
                      value={ans.isCorrect}
                      onChange={(e) => handleSwitch(e, index, i)}
                    />
                  </Flex>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Col>
      <Col span={24}>
        <Flex align="center" justify="space-between">
          <Button type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
          <Button type="primary" onClick={AddNewQuestion}>
            Add
          </Button>
        </Flex>
      </Col>
    </Row>
  );
};

export default Assessment;
