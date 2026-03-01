export type WsMessageType =
  | "terminal:input"
  | "terminal:output"
  | "terminal:resize"
  | "terminal:connected"
  | "terminal:error"
  | "terminal:close";

export interface WsMessage {
  type: WsMessageType;
  connectionId: string;
  data?: string;
  cols?: number;
  rows?: number;
  error?: string;
}
