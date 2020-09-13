export interface HueDevice {
  id: string;
  internalipaddress: string;
  link?: string;
  status?: Status;
}

export enum Status {
  LOADING = "STATUS_LOADING",
  OK = "STATUS_OK",
  NOT_OK = "STATUS_NOT_OK",
}
