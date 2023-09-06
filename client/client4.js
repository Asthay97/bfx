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

const orderBook = new OrderBook();

// // const trade1 = orderBook.executeTrade();
// const currentOrderBook = orderBook.getOrderBook();

peer.request('pushOrder', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  // push sell and buy orders to server
  orderBook.placeBuyOrder(100, 10);
  orderBook.placeSellOrder(102, 6);
})

peer.request('updateOrderBook', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  // listen to server to update own order book
  orderBook = data;
  console.log(JSON.stringify(data))
})

peer.request('matchOrder', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  // check if order matches, send to server to remove the order and re-add the order
})