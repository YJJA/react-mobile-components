import React, { useState, useCallback } from 'react';
import { ImageUpload } from './ImageUpload';
import { UploadFile } from './useFileUpload';

export default { title: 'Upload' };

export const UseImageUpload = () => {
  const [fileList, setFileList] = useState<UploadFile<string>[]>([]);

  /** 自行实现上传功能 */
  const onUpload = useCallback((file: UploadFile<string>) => {
    return Promise.resolve('');
  }, []);

  console.log(fileList);

  return (
    <div>
      <ImageUpload
        multiple
        value={fileList}
        onChange={setFileList}
        onUpload={onUpload}
      />
    </div>
  );
};
