import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useTransition } from '../Animation';
import { LayerPlacement, getLayerContentValues } from './layer-placement';

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9;
`;

const Content = styled.div`
  position: fixed;
  max-width: 100%;
  max-height: 100%;
  z-index: 10;
`;

export type LayerContainerProps = {
  visible: boolean;
  placement?: LayerPlacement;
  maskClosable?: boolean;
  onClose?(): void;
  onHideEnd?(): void;
};

export const LayerContainer: React.FC<LayerContainerProps> = ({
  visible,
  placement = LayerPlacement.center,
  children,
  maskClosable = true,
  onClose,
  onHideEnd
}) => {
  const bodyOption = getLayerContentValues(placement);
  const [maskShow, mask] = useTransition(visible, {
    from: { opacity: 0 },
    enter: { opacity: 1 }
  });

  const [bodyShow, body] = useTransition(visible, {
    from: bodyOption.from,
    enter: bodyOption.enter
  });

  const indexRef = useRef(0);
  useEffect(() => {
    if (!bodyShow) {
      if (indexRef.current >= 1) {
        onHideEnd && onHideEnd();
      }

      indexRef.current += 1;
    }
  }, [bodyShow, onHideEnd]);

  return (
    <div>
      {maskShow && (
        <Mask
          onClick={maskClosable ? onClose : undefined}
          style={{ opacity: mask.opacity }}
        />
      )}
      {bodyShow && (
        <Content
          style={{
            top: body.top,
            right: body.right,
            bottom: body.bottom,
            left: body.left,
            opacity: body.opacity,
            transform: `translate3d(${body.x}, ${body.y}, 0) scale(${
              body.scale
            })`
          }}
        >
          {children}
        </Content>
      )}
    </div>
  );
};
