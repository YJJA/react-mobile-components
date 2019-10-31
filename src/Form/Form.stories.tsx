import React from 'react';

import { Form } from '.';

import { Input } from '../Input';
import { useForm } from './useForm';
import { useField } from './useField';
import { Button } from '../Button';

export default { title: 'Form' };

export const UseForm = () => {
  const form = useForm({
    onSubmit: value => {
      console.log(value);
    }
  });

  return (
    <Form onSubmit={form.onSubmit}>
      <Input {...useField(form, 'nickname')} placeholder="请输入昵称" />
      <Button type="submit">提交</Button>
    </Form>
  );
};
