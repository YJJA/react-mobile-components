import * as React from "react";
import styled from "styled-components";
import posed from "react-pose";

const ActionSheetContentMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ActionSheetContentBody = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  width: 1;
`;

const ActionSheetContentItem = styled.div`
  height: 1rem;
  background-color: #fff;
  text-align: center;
  padding-top: 0.32rem;
  color: #ff4a08;
  font-size: 0.36rem;
  border-radius: 0.1rem;
  cursor: pointer;

  & + div {
    border-top: 1px solid #eee;
  }
`;

const ActionSheetContentCancel = styled(ActionSheetContentItem)`
  color: #4a4a4a;
  margin-top: 0.1rem;
`;

const ActionSheetMask = posed(ActionSheetContentMask)({
  visible: { opacity: 1, transition: { duration: 300 } },
  hidden: { opacity: 0, transition: { duration: 200 } },
});

const ActionSheetBody = posed(ActionSheetContentBody)({
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 300 },
  },
  hidden: {
    y: 100,
    opacity: 0,
    transition: { duration: 200 },
  },
});

export interface IActionSheetItem {
  label: string;
  value: any;
}

export interface IActionSheetContentProps {
  visible: boolean;
  onCancel(): void;
  onSelect(key: any): void;
  options: IActionSheetItem[];
}

export class ActionSheetContent extends React.Component<IActionSheetContentProps> {
  static defaultProps = {
    options: [],
  };

  onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.onSelect((e.target as any).id);
  };

  render() {
    const { visible, onCancel, options } = this.props;

    return (
      <>
        <ActionSheetMask pose={visible ? "visible" : "hidden"} />
        <ActionSheetBody pose={visible ? "visible" : "hidden"}>
          {options.map((item: IActionSheetItem) => {
            return (
              <ActionSheetContentItem key={item.value} id={item.value} onClick={this.onClick}>
                {item.label}
              </ActionSheetContentItem>
            );
          })}
          <ActionSheetContentCancel key="cancel" onClick={onCancel}>
            取消
          </ActionSheetContentCancel>
        </ActionSheetBody>
      </>
    );
  }
}
