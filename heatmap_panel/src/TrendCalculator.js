/** Class for calculating trend */
export default class TrendCalculator {
  /**
  * Returns k for a trendline based on datapoints.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  * @return {Integer} - the trend percentage
  */
  getTrend (datapoints) {
    var a = 0;
    var b = 0;
    var b1 = 0;
    var b2 = 0;
    var c = 0;
    var d = 0;
    var firstIndex = 0;
    var lastIndex = datapoints.length - 1;

    if (firstIndex >= lastIndex || lastIndex <= 0) {
      return 0;
    }

    for (var i = firstIndex; i <= lastIndex; i++) {
      if (datapoints[i][0]) {
        b1 += datapoints[i][0];
      }
      b2 += i;
      a += datapoints[i][0] * i;
      c += Math.pow(i, 2);
    }

    a = a * (lastIndex - firstIndex + 1);
    b = b1 * b2;
    d = Math.pow(b2, 2);
    c = c * (lastIndex - firstIndex + 1);

    var slope = (a - b) / (c - d);
    var first = (b1 - (slope * b2)) / (lastIndex - firstIndex + 1);
    var last = first + slope * (lastIndex - firstIndex);

    return this.getPercentageTrend(first, last);
  }

  /** Returns a simple trend based on first and last point in interval that is not null.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  * @returns {Number} - The trend in percent based on the first and last value not null.
  */
  getSimpleTrend (datapoints) {
    var y1 = datapoints[0][0];
    var y2 = datapoints[datapoints.length - 1][0];

    return this.getPercentageTrend(y1, y2);
  }

  /** Returns the change in percent based on the first and last point in trendline
  *
  * @param {Integer} first - The first value in datapoints
  * @param {Integer} last - The last value in datapoints
  * @returns {Number} returns the percentage based on a first and last.
  */
  getPercentageTrend (first, last) {
    if (first > 0) {
      return Math.round(((last - first) / first) * 1000) / 10;
    } else {
      return Math.round(((last - first) / 1) * 1000) / 10;
    }
  }
}
