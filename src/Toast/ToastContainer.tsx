import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition } from '../Animation';

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
`;

const Content = styled.div`
  position: fixed;
  left: 50%;
  top: 30%;
  max-width: 80%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -50%);
  padding: 6px 12px;
  border-radius: 5px;
  color: #fff;
  line-height: 1;
  text-align: center;
`;

const ContentIcon = styled.div`
  color: #fff;
`;

const ContentText = styled.div`
  color: #fff;
`;

export type ToastContainerProps = {
  visible: boolean;
  mask?: boolean;
  title: string;
  icon?: React.ReactNode;
  onHideEnd?(): void;
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  visible,
  mask = true,
  title,
  icon,
  onHideEnd
}) => {
  const [show, body] = useTransition(visible, {
    from: { opacity: 0 },
    enter: { opacity: 1 }
  });

  const indexRef = useRef(0);
  useEffect(() => {
    if (!show) {
      if (indexRef.current >= 1) {
        onHideEnd && onHideEnd();
      }

      indexRef.current += 1;
    }
  }, [show, onHideEnd]);

  return (
    <div>
      {mask && show && <Mask />}
      {show && (
        <Content style={{ opacity: body.opacity }}>
          {icon && <ContentIcon>{icon}</ContentIcon>}
          <ContentText>{title}</ContentText>
        </Content>
      )}
    </div>
  );
};
