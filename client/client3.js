'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const OrderBook = require('./orderbookFile'); 

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()


// Instantiate an empty order book
const orderBook = new OrderBook();
  
// Place buy and sell orders
orderBook.placeBuyOrder(202, 8);
orderBook.placeSellOrder(190, 4);

// Execute trades
// const trade1 = orderBook.executeTrade();
// const trade2 = orderBook.executeTrade();

// Get the current order book state
const currentOrderBook = orderBook.getOrderBook();

// console.log('Trades2:', trade1, trade2);
console.log('Current Order Book2:', currentOrderBook);

peer.request('rpc_test', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(data) // { msg: 'world' }
})
peer.request('get_orderBook', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(JSON.stringify(data)) // { msg: 'world' }
})