import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';

import { ToastContainer } from './ToastContainer';
import { isString } from '../utils/helpers';

export type ToastOpenProps = {
  title: string;
  icon?: React.ReactNode;
  timeout?: number;
  mask?: boolean;
  onClose?(): void;
};

/** open */
export const open = ({
  title,
  icon,
  timeout = 2500,
  mask = true,
  onClose
}: ToastOpenProps) => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  let visible = false;

  let timeId: number | null = null;

  const close = () => {
    if (visible) {
      visible = false;
      render();
      onClose && onClose();
    }
    timeId && clearTimeout(timeId);
  };

  const end = () => {
    ReactDOM.unmountComponentAtNode(el);
    document.body.removeChild(el);
  };

  const render = () => {
    ReactDOM.render(
      <ToastContainer
        visible={visible}
        title={title}
        mask={mask}
        icon={icon}
        onHideEnd={end}
      />,
      el
    );
  };

  render();
  raf(() => {
    visible = true;
    render();

    if (timeout) {
      timeId = setTimeout(close, timeout);
    }
  });

  return close;
};

export type ToastSuccessProps = Omit<ToastOpenProps, 'icon'>;

/** success */
export const success = (props: string | ToastSuccessProps) => {
  if (isString(props)) {
    return open({ title: props });
  }

  return open(props);
};

export type ToastFailProps = Omit<ToastOpenProps, 'icon'>;

/** fail */
export const fail = (props: string | ToastFailProps) => {
  if (isString(props)) {
    return open({ title: props });
  }

  return open(props);
};

export type ToastInfoProps = Omit<ToastOpenProps, 'icon'>;

/** info */
export const info = (props: string | ToastInfoProps) => {
  if (isString(props)) {
    return open({ title: props });
  }

  return open(props);
};

export type ToastLoadingProps = Omit<ToastOpenProps, 'icon'>;

/** loading */
export const loading = (props: string | ToastLoadingProps) => {
  if (isString(props)) {
    return open({ title: props, timeout: 0 });
  }

  return open({ ...props, timeout: 0 });
};
