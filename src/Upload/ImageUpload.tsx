import React from 'react';
import styled from 'styled-components';
import { useFileUpload, UseFileUploadProps } from './useFileUpload';
import { Image } from '../Image';

const Wrapper = styled.div``;

const Content = styled.div`
  display: flex;
`;

const Item = styled.div`
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddButton = styled(Item)`
  font-size: 36px;
  text-align: center;
  line-height: 80px;
  color: #666;
`;

export type ImageUploadProps<T> = UseFileUploadProps<T>;

export function ImageUpload<T = any>(props: ImageUploadProps<T>) {
  const [input, controls] = useFileUpload({
    accept: 'image/*',
    ...props
  });

  return (
    <Wrapper>
      {input}
      <Content>
        {(props.value || []).map(file => {
          return (
            <Item key={file.uid} onClick={controls.remove} id={file.uid}>
              <Image src={file.src} file={file.file} />
            </Item>
          );
        })}
        <AddButton onClick={controls.click}>+</AddButton>
      </Content>
    </Wrapper>
  );
}
