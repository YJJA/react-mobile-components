import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { PoseGroup } from "react-pose";

import { PickerMaskPose } from "./PickerMask";
import { PickerContentPose } from "./PickerContent";
import { PickerGroup, IPickerGroupOption } from "./PickerGroup";
import { uid } from "../utils/uid";

const PickerContentHeader = styled.header`
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PickerContentBtn = styled.button`
  border: none;
  height: 1rem;
  width: 1.2rem;
  background-color: #fff;
  color: #007bff;
  font-size: 0.28rem;
`;

const PickerContentBtnCancel = styled(PickerContentBtn)`
  color: #999;
`;

const PickerContentTitle = styled.h3`
  text-align: center;
  font-size: 0.28rem;
  color: #414141;
  font-weight: normal;
`;

const PickerContentBody = styled.div`
  position: relative;
  height: 4.26rem;
  padding: 0.4rem 0;
`;

const PickerContentMask = styled.div`
  z-index: 10;
  width: 100%;
  height: 1.37rem;
  pointer-events: none;
  transform: translateZ(0);
`;

const PickerContentMaskTop = styled(PickerContentMask)`
  position: absolute;
  top: 0.4rem;
  background: linear-gradient(0deg, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));
  border-bottom: 1px solid #ebebeb;
`;

const PickerContentMaskBottom = styled(PickerContentMask)`
  position: absolute;
  bottom: 0.4rem;
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));
  border-top: 1px solid #ebebeb;
`;

const PickerContentScrollWrapper = styled.div`
  display: flex;
`;

export type IPickerOptionProps = IPickerGroupOption[];

export interface IPickerProps {
  visible: boolean;
  title?: string;
  cancelText?: string;
  okText?: string;
  onOk?(value: any): void;
  onCancel?(): void;
  onChange?(value?: any): void;
  value?: any;
  defaultValue?: any;
  options: IPickerOptionProps[];
}

export interface IPickerState {
  uid: string;
  value: any;
}

export class Picker extends React.Component<IPickerProps, IPickerState> {
  static defaultProps = {
    cancelText: "取消",
    okText: "确认",
  };

  el: HTMLDivElement | null = null;

  state = {
    uid: uid("picker"),
    value: this.props.value || this.props.defaultValue,
  };

  componentDidMount() {
    this.el = document.createElement("div");
    document.body.appendChild(this.el);
    this.setState({
      uid: uid("picker"),
    });
  }

  componentWillUnmount() {
    if (this.el) {
      document.body.removeChild(this.el);
    }
  }

  onChange = (index: number, val: any) => {
    const { options } = this.props;
    const isMultiple = options.length > 1;
    let value = this.state.value;

    if (isMultiple) {
      if (!Array.isArray(value)) {
        value = Array(options.length);
      }
      value = [...value.slice(0, index), val, ...value.slice(index + 1)];
    } else {
      value = val;
    }

    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk(this.state.value);
    }
  };

  render() {
    if (!this.el) {
      return null;
    }

    const { title, options, cancelText, okText, visible } = this.props;
    const value = this.state.value;
    const valueArr = Array.isArray(value) ? value : [value];

    return ReactDOM.createPortal(
      <PoseGroup>
        {visible
          ? [
              <PickerMaskPose key="mask" />,
              <PickerContentPose key="content">
                <PickerContentHeader>
                  <PickerContentBtnCancel onClick={this.onCancel}>
                    {cancelText}
                  </PickerContentBtnCancel>
                  <PickerContentTitle>{title}</PickerContentTitle>
                  <PickerContentBtn onClick={this.onOk}>{okText}</PickerContentBtn>
                </PickerContentHeader>

                <PickerContentBody>
                  <PickerContentMaskTop />
                  <PickerContentMaskBottom />
                  <PickerContentScrollWrapper>
                    {options.map((group, index) => {
                      return (
                        <PickerGroup
                          key={index}
                          index={index}
                          options={group}
                          value={valueArr[index]}
                          onChange={this.onChange}
                        />
                      );
                    })}
                  </PickerContentScrollWrapper>
                </PickerContentBody>
              </PickerContentPose>,
            ]
          : []}
      </PoseGroup>,
      this.el
    );
  }
}
