// (C)grjoshi 5/29/2016
// gameModule.js - Match related functions
var utils = require("./PS2Utils.js");
var exports = module.exports;

//API function implementation

//return the next active match information
exports.getNextMatch = function (req,res,sqlConx) {

    var resObj = {
        count: 0,
        matchData: [],
        message: "",
        success: false
    };
    //Using isActive column to determine which matches are to be shown
    sqlConx.query(
        "SELECT team1.teamID as t1ID,team1.name as t1Name,team1.group as t1Group, team2.teamID as t2ID,team2.name as t2Name, team2.group as t2Group, match.matchID as matchID, match.isLocked as locked, match.MatchDate as date FROM `match` LEFT JOIN (teams as team1, teams as team2) ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) WHERE isActive=1",
        {type: sqlConx.QueryTypes.SELECT})
        .then(function (matches) {
            //fill response object and return
            resObj.success = true;
            resObj.count = matches.length;

            for (var n = 0; n < matches.length; n++) {
                resObj.matchData.push({
                    matchID: matches[n].matchID,
                    team1ID: matches[n].t1ID,
                    team1Name: matches[n].t1Name,
                    //team1Group: matches[n].t1Group,
                    team2ID: matches[n].t2ID,
                    team2Name: matches[n].t2Name,
                    //team2Group: matches[n].t2Group,
                    locked: (matches[n].locked == 0) ? false : true,        //this will enable/disable prediction for particular match
                    date: matches[n].date
                });
            }
            res.json(resObj);
            res.end();
        })
        .catch(function (err) {
            //match find failed. Reply with message
            utils.logMe("Error trying to fetch match details.Message:\n" + err);
            resObj.success = false;
            resObj.message = err;

            res.json(resObj);
            res.end();
        });
};

