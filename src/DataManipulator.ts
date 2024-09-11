import { ServerRespond } from './DataStreamer';

export interface Row {
    // Added the required raw stock data we need to receive from the server
        price_abc: 'number',
        price_def: 'number',
        timestamp: 'date',
        upper_bound: 'number',
        lower_bound: 'number',
        alert: 'number',
        ratio: 'number | undefined',
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
      // Added formulas to properly calculate price, ratio and upper/lower bounds
      // set returns to the proper variables and set the way alerts are handled (price lower than lowerbound and price higher than upperbound)
      const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
      const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
      const ratio = priceABC/priceDEF;
       const upperbound = 1 + 0.05;
       const lowerbound = 1 - 0.05;
    return {price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
        upper_bound: upperbound,
        lower_bound: lowerbound,
        alert: (ratio > upperbound || ratio < lowerbound) ? ratio : undefined,
        }
  }

}
