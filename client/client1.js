
'use strict'

const { PeerRPCClient,PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const OrderBook = require('./orderbookFile'); 

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const peerServer = new PeerRPCServer(link, {
  timeout: 300000
})
peerServer.init()

const port = 3000;//1024 + Math.floor(Math.random() * 1000)
const service = peerServer.transport('server')
service.listen(port)

setInterval(function () {
  link.announce('rpc_test_01', service.port, {})
}, 1000)

// Instantiate an empty order book
const orderBook = new OrderBook();
orderBook.placeBuyOrder(100, 5);
orderBook.placeSellOrder(101, 8); 
const currentOrderBook = orderBook.getOrderBook();

peer.request('rpc_test', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(data) // { msg: 'world' }
})


service.on('request_01', (rid, key, payload, handler) => {
  console.log(JSON.stringify(payload));
})