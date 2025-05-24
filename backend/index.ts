import { Hono } from 'hono';

declare var WebSocketPair: {
  new (): [WebSocket, WebSocket];
};

const app = new Hono();

app.get('/', (c) => c.text('Hono WebSocket server (Cloudflare Workers) is running!'));

app.get('/ws', (c) => {
  const upgradeHeader = c.req.header('Upgrade');
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 426);
  }
  // Cloudflare Workers: Use WebSocketPair
  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  // @ts-expect-error Cloudflare Workers provides accept() at runtime
  server.accept();
  server.addEventListener('message', (event) => {
    server.send(event.data);
  });
  // @ts-expect-error webSocket is a valid property in Workers runtime
  return new Response(null, { status: 101, webSocket: server });
});

export default app; 