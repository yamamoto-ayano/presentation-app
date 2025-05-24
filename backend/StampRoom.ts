export class StampRoom {
  state: any;
  sockets: Set<WebSocket>;

  constructor(state: any) {
    this.state = state;
    this.sockets = new Set();
  }

  async fetch(request: Request) {
    try {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }
      // @ts-expect-error Cloudflare Workers provides WebSocketPair at runtime
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

      // @ts-expect-error webSocket is a valid property in Workers runtime
      return new Response(null, { status: 101, webSocket: client });
    } catch (e) {
      // Cloudflareログで確認できる
      console.error("DO fetch error", e);
      return new Response("Internal Error", { status: 500 });
    }
  }
} 