import * as React from "react";
import { FormControl, IFieldComponentProps } from "../Form";

export interface IInputProps {
  field: IFieldComponentProps;
}

const FormControlInput = FormControl.withComponent("input");

export const Input = ({ field: { name, value, onChange } }: IInputProps) => {
  const ref = React.useRef<typeof onChange>(onChange);

  React.useEffect(() => {
    ref.current = onChange;
  });
  const changeHanler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    ref.current(name, value);
  }, []);

  return <FormControlInput value={value} onChange={changeHanler} />;
};
