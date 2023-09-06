class OrderBook {
    constructor() {
      this.buyOrders = [];  // Array to store buy orders
      this.sellOrders = []; // Array to store sell orders
    }
  
    // Place a buy order
    placeBuyOrder(price, quantity) {
      this.buyOrders.push({ price, quantity });
      this.sortOrdersByPrice(this.buyOrders);
    }
  
    // Place a sell order
    placeSellOrder(price, quantity) {
      this.sellOrders.push({ price, quantity });
      this.sortOrdersByPrice(this.sellOrders);
    }
  
    // Execute a trade between buy and sell orders
    executeTrade() {
      if (this.buyOrders.length === 0 || this.sellOrders.length === 0) {
        return "No orders to trade"; // No orders to trade
      }
  
      const bestBuyOrder = this.buyOrders[0];
      const bestSellOrder = this.sellOrders[0];
  
      if (bestBuyOrder.price >= bestSellOrder.price) {
        const quantity = Math.min(bestBuyOrder.quantity, bestSellOrder.quantity);
        this.buyOrders[0].quantity -= quantity;
        this.sellOrders[0].quantity -= quantity;
        if (bestBuyOrder.quantity === 0) {
          this.buyOrders.shift();
        }
        if (bestSellOrder.quantity === 0) {
          this.sellOrders.shift();
        }
        return { price: bestSellOrder.price, quantity };
      }
  
      return "No trade executed"; // No trade executed
    }
  
    // Utility function to sort orders by price (ascending)
    sortOrdersByPrice(orders) {
      orders.sort((a, b) => a.price - b.price);
    }
  
    // Get the current state of the order book
    getOrderBook() {
      return {
        buyOrders: this.buyOrders,
        sellOrders: this.sellOrders,
      };
    }
  }
  
  // // Example usage:
  // const orderBook = new OrderBook();
  
  // // Place buy and sell orders
  // orderBook.placeBuyOrder(100, 5);
  // orderBook.placeBuyOrder(99, 10);
  // orderBook.placeSellOrder(101, 8);
  // orderBook.placeSellOrder(102, 6);
  
  // // Execute trades
  // const trade1 = orderBook.executeTrade();
  // const trade2 = orderBook.executeTrade();
  
  // // Get the current order book state
  // const currentOrderBook = orderBook.getOrderBook();
  
  // console.log('Trades:', trade1, trade2);
  // console.log('Current Order Book:', currentOrderBook);
  
  module.exports = OrderBook;