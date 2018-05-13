const WebSocket = require('ws');

let wss;

module.exports = function (server) {
  if (server === undefined) return wss;
  wss = new WebSocket.Server({ server: server })
  
  wss.addListener('connection', (ws) => {
    ws.addListener('message', (msg) => {
      console.log(msg)
      if (msg === 'broadcast') {
        wss.clients.forEach(ws => {
          ws.send('THIS IS A BROADCAST')
        })
      } else {
        ws.send('ok')
      }
    })
    console.log('connection open')
  })


  return wss;
}