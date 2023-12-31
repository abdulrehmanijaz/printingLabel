/**
 * const LimitingMiddleware = require('limiting-middleware');
 * app.use(new LimitingMiddleware({ limit: 100, resetInterval: 1200000 }).limitByIp());
 *
 * 100 request limit. 1200000ms reset interval (20m)
 */

const DEFAULT_LIMIT = 100;
const MINUTES = 1000 * 60;
const HOURS = MINUTES * 60;
const DEFAULT_INTERVAL = MINUTES * 15;

class LimitingMiddleware {
  constructor({ limit, resetInterval } = {}) {
    this.ipHitsMap = {};
    this.limit = limit || DEFAULT_LIMIT;
    this.resetInterval = resetInterval || DEFAULT_INTERVAL;
    this.startResetInterval();
  }

  limitByIp() {
    return (req, res, next) => {
      const requesterIp = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown');

      //console.log('requesterIp', requesterIp);

      if (!this.ipHitsMap[requesterIp]) {
        this.ipHitsMap[requesterIp] = 1;
      } else {
        this.ipHitsMap[requesterIp] = this.ipHitsMap[requesterIp] + 1;
      }

      if (this.ipHitsMap[requesterIp] > this.limit) {
        const rate = this.resetInterval/MINUTES;
        const error = 'Too many wrong attempts please try again after 15 minutes!';
        
        //res.send('Too many wrong attempts please try again after 15 minutes!')
        //   `Your ip has exceeded the ${this.limit} request limit per ${rate} minute(s). Try again in in ${rate} minute(s).`
        // ;

       

        throw error;
      }

      next();
    }
  }

  resetIpHitsMap() {
    //console.log('Reset ipHitMap');
    this.ipHitsMap = {};
  }

  startResetInterval(interval = this.resetInterval) {
    setInterval(() => this.resetIpHitsMap(), interval);
  }
}

module.exports = LimitingMiddleware;
