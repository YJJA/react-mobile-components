import React, { useCallback } from 'react';
import { ActionSheet } from './index';

export default { title: 'ActionSheet' };

export const UseActionSheet = () => {
  const onClick = useCallback(() => {
    ActionSheet.showActionSheet(
      {
        options: [{ key: 'one', text: '项目一' }, { key: '2', text: '项目二' }]
      },
      (key: string) => {
        console.log(key);

        return new Promise(resolve => {
          setTimeout(() => resolve(), 2000);
        });
      }
    );
  }, []);

  return (
    <div>
      <button onClick={onClick}>开始</button>
    </div>
  );
};
