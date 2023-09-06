
'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const OrderBook = require('../client/orderbookFile');
// const Grenache = require('./../')
// const PeerPub = Grenache.PeerPub

// Instantiate an empty order book
const orderBook = new OrderBook();
const orderBookAtTrade = new OrderBook();

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
// const peer = new PeerPub(link,{})
peer.init()

const port = 3000;//1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)
const service2 = peer.transport('server')
service2.listen(3003);

setInterval(function () {
  link.announce('rpc_test', service.port, {})
  link.announce('get_orderBook', service2.port,{})
  link.announce('trade_happening', service2.port, {} )
}, 1000)

// Get the current order book state
const currentOrderBook = orderBook.getOrderBook();
console.log('initial order book', currentOrderBook);

service.on('request', (rid, key, payload, handler) => {
  console.log(JSON.stringify(payload));
  orderBook.buyOrders.push(payload.msg.buyOrders[0]);
  orderBook.sellOrders.push(payload.msg.sellOrders[0]);

  // add global order book 
  console.log(JSON.stringify(payload))
  const newOrderBook = orderBook.getOrderBook();
  console.log(JSON.stringify(newOrderBook)); 
  const trade1 = orderBook.executeTrade();
  console.log('trade exec: ', trade1);
  console.log(JSON.stringify(orderBook.getOrderBook()));

  console.log('handler', JSON.stringify(handler));
  handler.reply(null, { msg: 'world' })
})

service2.on('request', (rid, key, payload, handler) => {
  handler.reply(null, { msg: orderBook.getOrderBook() })
})

service2.on('request', (rid, key, payload, handler) => {
  handler.reply(null, { msg: 'trade-happening' })
})

service2.on('request', (rid, key, payload, handler) => {
  handler.reply(null, { msg: 'trade-occured' })
})