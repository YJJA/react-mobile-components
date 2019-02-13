import * as React from "react";
import request, { Response, SuperAgentRequest } from "superagent";

import { uid } from "../utils/uid";

const empty = () => null;

export interface IUploadFile extends File {
  uid: string;
  url?: string;
  status?: string;
  event?: string;
  response?: Response;
  error?: any;
}

export interface IUploadBody {
  [key: string]: any;
}

export interface IUploadHeaders {
  [key: string]: any;
}

export interface IUploadRenderProps {
  fileList: IUploadFile[];
  onClick(): void;
  start(fileList?: IUploadFile[]): void;
  abort(file?: IUploadFile | string): void;
}

export interface IUploadProps {
  action: string;
  value: IUploadFile[];
  render?(props: IUploadRenderProps): React.ReactElement<any>;
  onChange(value: IUploadFile[]): void;
  component?: React.ReactType<any>;
  children?: React.ReactNode;

  name?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  auto?: boolean;
  withCredentials?: boolean;
  data?: () => IUploadBody | IUploadBody;
  headers?: () => IUploadHeaders | IUploadHeaders;
  beforeUpload?(file: IUploadFile): boolean;
  afterUpload?(): boolean;
  onStart?(file: IUploadFile): void;
  onSuccess?(file: IUploadFile, response: Response): void;
  onError?(file: IUploadFile, error: any): void;
  onProgress?(file: IUploadFile, event: any): void;
  onComplete?(): void;
}

export interface IUploadState {
  uid: string;
  fileList: IUploadFile[];
}

export class Upload extends React.Component<IUploadProps, IUploadState> {
  static defaultProps = {
    component: "span",
    name: "file",
    multiple: false,
    disabled: false,
    beforeUpload: empty,
    onStart: empty,
    onSuccess: empty,
    onError: empty,
    onProgress: empty,
    onChange: empty,
    onComplete: empty,
    withCredentials: false,
    auto: true,
  };

  state = {
    uid: uid("upload"),
    fileList: this.props.value || [],
  };

  input: React.RefObject<any> = React.createRef();

  reqs: { [key: string]: SuperAgentRequest } = {};

  updateFile(file: IUploadFile) {
    const { fileList } = this.state;
    const index = fileList.findIndex(item => item.uid === file.uid);
    let nextFileList = [...fileList.slice(0, index), file, ...fileList.slice(index + 1)];
    this.setState({ fileList: nextFileList });
    this.props.onChange(nextFileList);
  }

  onStart(file: IUploadFile) {
    file.status = "start";
    this.updateFile(file);

    if (this.props.onStart) {
      this.props.onStart(file);
    }
  }

  onProgress(file: IUploadFile, event: any) {
    file.event = event;
    this.updateFile(file);

    if (this.props.onProgress) {
      this.props.onProgress(file, event);
    }
  }

  onSuccess(file: IUploadFile, response: Response) {
    file.status = "success";
    file.response = response;
    this.updateFile(file);

    if (this.props.onSuccess) {
      this.props.onSuccess(file, response);
    }
  }

  onError(file: IUploadFile, error: any) {
    file.status = "error";
    file.error = error;
    this.updateFile(file);

    if (this.props.onError) {
      this.props.onError(file, error);
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: IUploadFile[] = Array.from(e.target.files || []).map((file: any) => {
      file.uid = uid("upload");
      file.status = "normal";
      return file;
    });

    let fileList = [...this.state.fileList, ...files];
    this.setState({ fileList, uid: uid("upload") });
    if (this.props.auto) {
      setTimeout(() => this.start(fileList));
    }
  };

  start = (fileList = this.state.fileList) => {
    fileList.forEach(file => {
      this.upload(file);
    });
  };

  upload = (file: IUploadFile) => {
    const { action, name, data, headers, beforeUpload, afterUpload, withCredentials } = this.props;

    // 判断是否是未上传的文件
    if (!file.status || file.status !== "normal") {
      return file;
    }

    // 判断是否可以上传
    if (beforeUpload) {
      const before = beforeUpload(file);
      if (before === false) {
        return file;
      }
    }

    // 开始上传
    this.onStart(file);

    const req = request.post(action).attach(name || "file", file);

    if (headers) {
      req.set(typeof headers === "function" ? headers() : headers);
    }

    if (data) {
      req.field(typeof data === "function" ? data() : data);
    }

    req.on("progress", event => {
      this.onProgress(file, event);
    });

    if (withCredentials) {
      req.withCredentials();
    }

    // 自定义上传返回值判断上传状态
    if (afterUpload) {
      req.ok(afterUpload);
    }

    req
      .then(response => {
        delete this.reqs[file.uid];
        this.onSuccess(file, response);
        return file;
      })
      .catch(error => {
        delete this.reqs[file.uid];
        this.onError(file, error);
        return file;
      });
    this.reqs[file.uid] = req;
    return req;
  };

  abort = (file?: IUploadFile | string) => {
    if (file) {
      const uid = typeof file === "string" ? file : file.uid;
      if (this.reqs[uid]) {
        this.reqs[uid].abort();
        delete this.reqs[uid];
      }
    } else {
      Object.keys(this.reqs).forEach(uid => {
        if (this.reqs[uid]) {
          this.reqs[uid].abort();
        }
        delete this.reqs[uid];
      });
    }
  };

  onClick = () => {
    const event = new MouseEvent("click");
    this.input.current.dispatchEvent(event);
  };

  render() {
    const { component: Wrapper = "span", render, children, multiple, accept } = this.props;
    const { fileList } = this.state;
    const input = (
      <input
        key={this.state.uid}
        style={{ display: "none" }}
        ref={this.input}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={this.onChange}
      />
    );

    if (render) {
      return (
        <Wrapper>
          {input}
          {render({
            fileList,
            onClick: this.onClick,
            start: this.start,
            abort: this.abort,
          })}
        </Wrapper>
      );
    }

    return (
      <Wrapper onClick={this.onClick}>
        {input}
        {children}
      </Wrapper>
    );
  }
}
