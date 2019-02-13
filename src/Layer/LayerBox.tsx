import * as React from "react";
import styled from "styled-components";
import { Button } from "../Button";

const LayerBoxWrapper = styled.div`
  background-color: #fff;
  border-radius: 0.1rem;
  padding: 0 0.24rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const LayerBoxHeader = styled.div`
  font-size: 0.36rem;
  padding-top: 0.46rem;
  text-align: center;
  color: #4a4a4a;
`;

const LayerBoxBody = styled.div`
  padding: 0.5rem 0.2rem;
  min-height: 1rem;
  font-size: 0.32rem;
  line-height: 0.4rem;
  color: #4a4a4a;
  text-align: center;
`;

const LayerBoxFooter = styled.div`
  position: relative;
  height: 1.1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;

  &::after {
    content: "";
    position: absolute;
    top: 0.32rem;
    bottom: 0.32rem;
    left: 50%;
    width: 1px;
    background-color: #eee;
  }
`;

const LayerBoxButton = styled(Button)`
  flex: 1;
  border: none;
  background-color: #fff;
  font-size: 0.36rem;
  color: #9b9b9b;
`;

const LayerBoxButtonOk = styled(LayerBoxButton)`
  color: #fe4907;
`;

export interface ILayerBox {
  title?: string;
  onCancel?(): void;
  onOk?(): void;
  content?: any;
  cancelText?: string;
  okText?: string;
  cancel?: boolean;
  footer?: boolean;
}

export const LayerBox: React.SFC<ILayerBox> = ({
  title,
  footer,
  content,
  cancel,
  onCancel,
  onOk,
  cancelText,
  okText,
}: ILayerBox) => {
  return (
    <LayerBoxWrapper>
      {title && <LayerBoxHeader>{title}</LayerBoxHeader>}
      <LayerBoxBody>{content}</LayerBoxBody>
      {footer && (
        <LayerBoxFooter>
          {cancel && (
            <LayerBoxButton onClick={onCancel} type="button">
              {cancelText}
            </LayerBoxButton>
          )}
          <LayerBoxButtonOk onClick={onOk} type="button">
            {okText}
          </LayerBoxButtonOk>
        </LayerBoxFooter>
      )}
    </LayerBoxWrapper>
  );
};

LayerBox.defaultProps = {
  cancelText: "取消",
  okText: "确认",
  cancel: true,
  footer: true,
};
