import { Hono } from 'hono';
import { StampRoom } from './StampRoom';

declare var STAMP_ROOM: any;
declare var WebSocketPair: {
  new (): [WebSocket, WebSocket];
};

// DurableObjectNamespace型のダミー定義（Cloudflare Workers本番では自動で型付与される）
type DurableObjectNamespace = any;

const app = new Hono();

app.get('/', (c) => c.text('Hono WebSocket server (Cloudflare Workers + Durable Objects) is running!'));

app.get('/ws', async (c) => {
  // Cloudflare Workersではenv経由でバインディングを取得
  const env = c.env as { STAMP_ROOM: DurableObjectNamespace };
  const id = env.STAMP_ROOM.idFromName('main');
  const obj = env.STAMP_ROOM.get(id);
  return obj.fetch(c.req.raw);
});

export default app;
export { StampRoom } from './StampRoom'; 