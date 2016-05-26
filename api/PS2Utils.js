// (C)grjoshi 3/30/2016
// PS2Utils.js - Utility functions for PredictSoft v2.00


/* logMe(message) - Log messages to console */

module.exports.logMe = function (message) {
    var dt = (new Date()).toString().split(' ').splice(1, 4).join(' ');
    console.log("[" + dt + "] " + message);
}