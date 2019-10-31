import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';
import { LayerAlert, LayerAlertProps } from './LayerAlert';

export const alert = (
  title: string,
  content: React.ReactNode,
  actions: LayerAlertProps['actions']
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
      <LayerAlert
        visible={visible}
        title={title}
        actions={actions}
        onClose={onClose}
        onHideEnd={onHideEnd}
      >
        {content}
      </LayerAlert>,
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
