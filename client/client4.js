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
const f1 = async (orders, amount, quantity) => {
  if(orders === 'buy'){
    orderBook.placeBuyOrder(100, 10);
  }
  else{
    orderBook.placeSellOrder(102, 6);
  }
  const currentOrderBook = orderBook.getOrderBook();

  peer.request('pushOrder', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    console.log('current order book', currentOrderBook);
  })
}

setInterval(function () {
  peer.request('updateOrderBook', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    // listen to server to update own order book
    orderBook = data;
    console.log(JSON.stringify(data))
  })
}, 1000)

setInterval(function () {
  if (this.buyOrders.length === 0 || this.sellOrders.length === 0) {
    return "No orders to trade"; // No orders to trade
  }

  const bestBuyOrder = this.buyOrders[0];
  const bestSellOrder = this.sellOrders[0];
  
  // check if order matches
  if (bestBuyOrder.price >= bestSellOrder.price) {
    // send to server to remove the order

    peer.request('matchOrder', { msg: currentOrderBook }, { timeout: 10000 }, (err, data) => {
      if (err) {
        console.error(err)
        process.exit(-1)
      }
      // re-add the order
    })
    executeTrade()
    //remaining add

  }
}, 1000)