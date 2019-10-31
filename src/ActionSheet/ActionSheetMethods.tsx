import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';
import { ActionSheet, ActionSheetProps } from './ActionSheet';

export type ShowActionSheetOptions = Omit<
  ActionSheetProps,
  'onSelect' | 'onClose' | 'visible'
>;

type showActionSheetCallback = ActionSheetProps['onSelect'];

export const showActionSheet = (
  options: ShowActionSheetOptions,
  callback: showActionSheetCallback
) => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  let visible = false;

  const onClose = () => {
    if (visible) {
      visible = false;
      render();
    }
  };

  const onHideEnd = () => {
    ReactDOM.unmountComponentAtNode(el);
    document.body.removeChild(el);
  };

  const render = () => {
    ReactDOM.render(
      <ActionSheet
        visible={visible}
        {...options}
        onClose={onClose}
        onSelect={callback}
        onHideEnd={onHideEnd}
      />,
      el
    );
  };

  render();
  raf(() => {
    visible = true;
    render();
  });

  return onClose;
};
