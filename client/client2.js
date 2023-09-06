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
  
// // Place buy and sell orders
orderBook.placeBuyOrder(100, 10);
orderBook.placeSellOrder(102, 6);

// // const trade1 = orderBook.executeTrade();
// const currentOrderBook = orderBook.getOrderBook();

peer.request('rpc_test', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }

  const trade = orderBook.executeTrade();
  if(trade!==null){
    const currentOrderBook = orderBook.getOrderBook();
  }
  
  console.log(data, trade, currentOrderBook); 
})

peer.request('get_orderBook', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  orderBook = data;
  console.log(JSON.stringify(data))
})