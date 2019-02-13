import styled from "styled-components";
import posed from "react-pose";

const PickerMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const PickerMaskPose = posed(PickerMask)({
  enter: {
    opacity: 1,
    transition: {
      duration: 300,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 200,
    },
  },
});
