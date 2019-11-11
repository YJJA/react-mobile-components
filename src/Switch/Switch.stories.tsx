import React from 'react';
import { Switch } from './Switch';
import { useBoolean } from '../hooks';

export default { title: 'Switch' };

export const UseSwitch = () => {
  const [checked, toggle] = useBoolean();

  return (
    <div>
      <Switch value={checked} onChange={toggle} />
      <Switch value={checked} onChange={toggle} color="#fc3" />
    </div>
  );
};
