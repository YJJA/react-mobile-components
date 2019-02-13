import styled from "styled-components";
import posed from "react-pose";

const PickerContentWrapper = styled.section`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow: hidden;
  text-align: center;
  background-color: #fff;
`;

export const PickerContentPose = posed(PickerContentWrapper)({
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 200 },
  },
  hidden: {
    y: 100,
    opacity: 0,
    transition: { duration: 200 },
  },
});
