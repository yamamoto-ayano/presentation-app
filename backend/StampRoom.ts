export class StampRoom {
  state: any;
  sockets = new Set<WebSocket>();

  constructor(state: any) {
    this.state = state;
  }

  async fetch(request: Request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }
    // @ts-expect-error
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.accept();

    this.sockets.add(server);

    server.addEventListener("message", (event) => {
      for (const ws of this.sockets) {
        try {
          ws.send(event.data);
        } catch (e) {
          this.sockets.delete(ws);
        }
      }
    });

    server.addEventListener("close", () => {
      this.sockets.delete(server);
    });
    server.addEventListener("error", () => {
      this.sockets.delete(server);
    });

    // @ts-expect-error
    return new Response(null, { status: 101, webSocket: client });
  }
} 