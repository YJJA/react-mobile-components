import * as React from "react";
import styled from "styled-components";
import BScroll from "better-scroll";

const PickerGroupScroll = styled.div`
  height: 3.46rem;
  overflow: hidden;
  flex: 1;
`;

const PickerGroupWrapper = styled.div.attrs({
  className: "wheel-scroll",
})`
  margin-top: 1.37rem;
  line-height: 0.72rem;
  flex: 1;
  font-size: 0.36rem;
  color: #333;
`;

const PickerItem = styled.div.attrs({
  className: "wheel-item",
})`
  height: 0.72rem;
  overflow: hidden;
  white-space: nowrap;
`;

export interface IPickerGroupOption {
  key?: any;
  value: any;
  label: string;
}

export interface IPickerGroupProps {
  value?: string;
  onChange?(index: number, value: any): void;
  index: number;
  options: IPickerGroupOption[];
}

export class PickerGroup extends React.Component<IPickerGroupProps> {
  wheel: BScroll | null = null;
  ref: React.RefObject<any> = React.createRef();

  componentDidMount() {
    this.createWheel();
  }

  componentDidUpdate(prevProps: IPickerGroupProps) {
    if (this.props.value !== prevProps.value || this.props.index !== prevProps.index) {
      this.createWheel();
    }
  }

  componentWillUnmount() {
    if (this.wheel) {
      this.wheel.destroy();
    }
  }

  onChange = () => {
    if (this.wheel) {
      const { options, index } = this.props;
      const selectedIndex = this.wheel.getSelectedIndex();
      const value = options[selectedIndex].value;

      if (this.props.onChange) {
        this.props.onChange(index, value);
      }
    }
  };

  createWheel() {
    const { options, value } = this.props;
    let selectedIndex = options.findIndex(option => option.value === value);

    if (selectedIndex < 0) {
      selectedIndex = 0;
    }

    if (!this.wheel) {
      this.wheel = new BScroll(this.ref.current, {
        wheel: {
          selectedIndex,
          adjustTime: 140,
          wheelWrapperClass: "wheel-scroll",
          wheelItemClass: "wheel-item",
        },
        probeType: 3,
      });

      this.wheel.on("scrollEnd", this.onChange);
    } else {
      this.wheel.refresh();
      this.wheel.wheelTo(selectedIndex);
    }
  }

  render() {
    return (
      <PickerGroupScroll ref={this.ref}>
        <PickerGroupWrapper>
          {this.props.options.map(option => {
            return <PickerItem key={option.key || option.value}>{option.label}</PickerItem>;
          })}
        </PickerGroupWrapper>
      </PickerGroupScroll>
    );
  }
}
