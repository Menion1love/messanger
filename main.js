import http from "node:http";
import fs from "node:fs"
import fsw from "node:fs/promises"
import express from "express";
import {WebSocketServer} from "ws";


const hist = [];
const users = []
const app = express();
let cnt = 0;

const clients = [];

app.get("/", (req, res, next) => {
  cnt++;
  console.log(cnt);
  console.log(clients)
  next();
})

app.use(express.static("client"))

const server = http.createServer(app);

const wss = new WebSocketServer({ server });   

wss.on("connection", (ws) => {
  clients.push(ws)
  for (let c in clients)
    clients[c].send(hist.join(''))
  ws.on("message", (message) => {
    let newm = message.toString()
    let ch = newm.split('') 
    if (ch[15] == 't' && ch[16] == 't' && ch[17] == 'd')
    {
      hist.push(newm)
      for (let c in clients)
        clients[c].send(hist.join(''))
    } 
    else if (ch[0] = 'n' && ch[1] == 'o')
    {
      hist.pop()
      for (let c in clients)
        clients[c].send(hist.join(''))
    } 
    else {
      hist.pop()
      hist.push(newm)
      fsw.writeFile("./client/chat.txt", hist.join(''))
      for (let c in clients)
        clients[c].send(hist.join(''))
    } 
    });

  ws.on("close", () => {
    let a = hist.pop()
    let ch = a.split('')
    if (ch[15] != 't' && ch[16] != 't' && ch[17] != 'd')
      hist.push(a)
    clients.pop(ws);
  })
})

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
  console.log(hist.push(fs.readFileSync('./client/chat.txt', 'utf8')))

  console.log(`Server started on http://${host}:${port}`);
});
