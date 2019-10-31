import React, { useCallback } from 'react';
import { Button } from '../Button';
import { Toast } from './Toast';

export default { title: 'Toast' };

export const UseToast = () => {
  const open = useCallback(() => {
    Toast.open({
      title: '提示信息'
    });
  }, []);
  const success = useCallback(() => {
    Toast.success({
      title: '成功提示信息'
    });
  }, []);
  const fail = useCallback(() => {
    Toast.fail({
      title: '失败提示信息'
    });
  }, []);
  const loading = useCallback(() => {
    const close = Toast.loading('加载中...');

    setTimeout(close, 2000);
  }, []);

  return (
    <div>
      <Button onClick={open}>显示</Button>
      <Button onClick={success}>成功</Button>
      <Button onClick={fail}>失败</Button>
      <Button onClick={loading}>加载中</Button>
    </div>
  );
};
