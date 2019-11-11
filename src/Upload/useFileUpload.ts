import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect
} from 'react';
import raf from 'raf';

import uid from '../utils/uid';
import { useRefProps } from '../hooks';

/** file upload */

export type UploadFile<T = any> = {
  uid: string;
  src?: string;
  file?: File;
  status?: 'wait' | 'uploading' | 'done' | 'error';
  response?: T;
  error?: any;
  progress?: number;
};

export type UseFileUploadProps<T = any> = {
  value?: UploadFile<T>[];
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  /** 是否选中文件后自动上传 */
  auto?: boolean;
  /** 单个文件上传方法，用户自行实现 */
  onUpload(
    file: UploadFile<T>,
    progressHandler: (progress: number) => void
  ): Promise<T>;
  /** files 值发生变化触发的回调函数 */
  onChange(value: UploadFile<T>[]): void;
};

const inputStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  width: 1,
  height: 1,
  zIndex: 2
};

export const useFileUpload = <T>(props: UseFileUploadProps<T>) => {
  const { value, multiple, accept, disabled } = props;
  const propsRef = useRefProps(props);
  const [inputKey, setInputKey] = useState(() => uid('input'));
  const fileListRef = useRefProps(value || []);
  const inputRef = useRef<HTMLInputElement>(null);

  /** update file */
  const updateFile = useCallback((changedFile: UploadFile) => {
    const fileList = fileListRef.current;
    const nextFileList = fileList.map(file => {
      if (file.uid === changedFile.uid) {
        return changedFile;
      }
      return file;
    });

    const { onChange } = propsRef.current;
    onChange(nextFileList);
  }, []);

  /** upload file */
  const onUploadFile = useCallback(async (file: UploadFile) => {
    /** 如果 文件已上传过 不用重新上传 */
    if (!file.file || file.status === 'done' || file.status === 'error') {
      return;
    }

    const { onUpload } = propsRef.current;

    const onProgress = (progress: number) => updateFile({ ...file, progress });
    updateFile({ ...file, status: 'uploading', progress: 0 });

    return onUpload(file, onProgress)
      .then(response => {
        updateFile({ ...file, status: 'done', response });
      })
      .catch(error => {
        updateFile({ ...file, status: 'error', error });
      });
  }, []);

  /** controls */
  const controls = useMemo(
    () => ({
      /** 选择文件 */
      click: () => {
        const event = new MouseEvent('click');
        if (inputRef.current) {
          inputRef.current.dispatchEvent(event);
        }
      },

      /** 开始上传 */
      upload: async () => {
        const fileList = fileListRef.current;
        for (const file of fileList) {
          await onUploadFile(file);
        }
      },

      /** 删除文件 */
      remove(e: React.SyntheticEvent | string) {
        const uid = typeof e === 'string' ? e : e.currentTarget.id;
        const fileList = fileListRef.current;
        const nextFileList = fileList.filter(file => file.uid !== uid);

        const { onChange } = propsRef.current;
        onChange(nextFileList);
      },

      /** 清除文件列表 */
      clear: () => {
        const { onChange } = propsRef.current;
        onChange([]);
      }
    }),
    []
  );

  /** change event */
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files: UploadFile<T>[] = Array.from(e.target.files || []).map(
      file => ({
        file,
        uid: uid('file'),
        status: 'wait'
      })
    );

    const { onChange } = propsRef.current;
    const fileList = fileListRef.current;
    onChange([...fileList, ...files]);
    setInputKey(uid('input'));

    /** 是否自动上传 */
    const { auto } = propsRef.current;
    if (auto) {
      raf(controls.upload);
    }
  }, []);

  /** file input element */
  const fileInput = React.createElement('input', {
    multiple,
    accept,
    disabled,
    onChange,
    ref: inputRef,
    key: inputKey,
    type: 'file',
    style: inputStyle
  });

  return [fileInput, controls] as const;
};
