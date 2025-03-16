import NodeCache from "node-cache";

let rateControlCache

if (process.env.NODE_ENV === 'production') {
    rateControlCache = new NodeCache({stdTTL: 60})
} else {
  if (!global.rateControlCache) {
    global.rateControlCache = new NodeCache({stdTTL: 60})
  }
  rateControlCache = global.rateControlCache
}

export default rateControlCache