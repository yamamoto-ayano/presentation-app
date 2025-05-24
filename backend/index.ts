import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { WebSocketServer } from 'ws';
import type { Server } from 'http';

const app = new Hono();

app.get('/', (c) => c.text('Hono WebSocket server is running!'));

// HTTPサーバーを起動
const server = serve({
  fetch: app.fetch,
  port: 8787,
});

// WebSocketサーバーを同じポートで起動
const wss = new WebSocketServer({ server: server as unknown as Server });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'info', message: 'WebSocket connected!' }));

  ws.on('message', (data) => {
    // 受信したメッセージを全クライアントにブロードキャスト
    (wss.clients as Set<typeof ws>).forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });
});

console.log('Hono + WebSocket server started on http://localhost:8787'); 