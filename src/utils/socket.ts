import Axios, { AxiosInstance } from "axios";
import { RgbColor } from "react-colorful";

const baseUrl = process.env.REACT_APP_BACKEND_HTTP_URL ?? "";
const socketUrl = process.env.REACT_APP_BACKEND_SOCKET_URL ?? "";

class Server {
  server: AxiosInstance;
  socket?: WebSocket;
  socketUrl: string;
  initialSocketState: any;

  constructor(socketUrl: string) {
    this.server = Axios.create({
      baseURL: baseUrl,
    });
    this.socketUrl = socketUrl;
  }

  createWebSocket(): WebSocket {
    const socket = new WebSocket(this.socketUrl);
    socket.onopen = () => {
      console.log("socket connected");
    };
    socket.onclose = (e: any) => {
      console.log(`socket disconnected : ${e.code} ${e.reason}`);
      this.connect();
    };
    socket.onmessage = (e: any): void => {
      if (e.data === "OK") {
        return;
      } else {
        this.initialSocketState = e.data;
      }
    };
    return socket;
  }

  connect(): void {
    this.socket = this.createWebSocket();
  }

  disconnect(): void {
    this.socket?.close();
  }

  getSocketStatus(): "CONNECTED" | "ERROR" {
    return this.socket?.readyState === WebSocket.OPEN ? "CONNECTED" : "ERROR";
  }

  getInitialState(): RgbColor | null {
    if (this.initialSocketState) {
      const { red, green, blue } = JSON.parse(this.initialSocketState);
      return { r: red, g: green, b: blue };
    }
    return null;
  }

  async sendToHttp(input: RgbColor) {
    try {
      await this.server.get("/rgb", {
        params: input,
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendToSocket(input: RgbColor): void {
    const payload = {
      red: input.r,
      green: input.g,
      blue: input.b,
    };
    this.socket?.send(JSON.stringify(payload));
  }
}

const server = new Server(socketUrl);

export default server;
