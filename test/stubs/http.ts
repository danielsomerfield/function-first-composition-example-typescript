import { Request, Response } from "express";
import { Send } from "express-serve-static-core";

export const stubRequest = () => ({} as unknown as Request);

export const stubResponse = (): StubResponse & Response =>
  new StubResponseImpl() as unknown as StubResponse & Response;

export interface StubResponse {
  getSentBody(): any;
  getHeader(name: string): string | string[];
}

export interface StubRequest extends Request {}

class StubResponseImpl implements StubResponse {
  private sentBody: any;
  private headers: Record<string, string | string[]> = {};

  statusCode: number = -1;

  getSentBody(): any {
    return this.sentBody;
  }

  header(name: string, value: string | string[]): this {
    this.headers[name] = value;
    return this;
  }

  getHeader(name: string): string | string[] {
    return this.headers[name];
  }

  contentType(type: string): this {
    this.headers["content-type"] = type.toLowerCase();
    return this;
  }

  send: Send<any, this> = (body: any) => {
    this.sentBody = body;
    return this;
  };

  status(code: number): this {
    this.statusCode = code;
    return this;
  }
}
