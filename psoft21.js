/*
(C)grjoshi 5/24/2016

 * v2.10 - MODIFIED FOR EURO 2016
 * psoft2.js - Main server code for PredictSoft v2
			Handles database operations and APIs for reading/writing data
      Forked off of NoFApp v1 built for Twenty 20 Cricket 2016
    
 * */

var nofapp = 'PSOFT21_EURO';        //identifier for application
var port = 8088;                    //port that server will run on
var express = require('express');
var app = express();
var morgan = require('morgan');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');      //for letting Express handle POST data
var favicon = require('serve-favicon');

var dbconfig = require('./api/dbconfig.js');        //load config module

//load API modules
var utils = require("./api/PS2Utils.js");

/*==========================DB definitions================================*/

var sqlConn = new Sequelize(
    dbconfig.database,      //DB
    dbconfig.user,          //user
    dbconfig.password,      //pass
    {
        host: dbconfig.host,
        dialect: 'mysql',
        logging: false,
        define: {
            freezeTableName: true,          //so table names won't be assumed pluralized by the ORM
            timestamps: false               //not using sequelize timestamps
        },
        pool: {
            max: 50,
            min: 0,
            idle: 10000
        }
    });

var Users = sqlConn.import(__dirname + "/models/userModel");
var Prediction = sqlConn.import(__dirname + "/models/predictionModel");
var Match = sqlConn.import(__dirname + "/models/matchModel");

sqlConn.sync();

utils.logMe("*** Sequelize models loaded");

app.use(express.static(__dirname));
app.use(favicon(__dirname + '/assets/img/favicon.ico'));

app.use(bodyParser.json());                 		//this lets Express handle POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

/*=====================================Routing and APIs=====================================*/

var router = express.Router();

var userModule = require("./api/userModule.js");
var gameModule = require("./api/gameModule.js");

//middleware to use for all requests...
router.use(function (req, res, next) {
    //utils.logMe("Middleware layer entered...") ;
    next();             //move on...
});

//default route
router.get("/", function (req, res) {
    //res.json({message: nofapp +' v2.1 API'});
    res.redirect('/src/app/index.html');
});

//TODO: Find out how to make the following work...
/*
router.get("/nextmatch", function (req,res) {
    gameModule.getNextMatch((req,res,sqlConn));
})
*/

router.post("/login",function (req, res) {
    userModule.logIn(req,res,Users);
});

router.post("/adduser",function(req,res){
    userModule.addUser(req,res,Users);
});

//get leaderboard scores, sorted by points
app.get("/api/getLeaderboardScores", function (req, res) {
    gameModule.getScoreBoard(req, res, Users);
});

//get points for user
app.get("/api/getUserPoints", function (req, res) {
    userModule.getUserPoints(req, res, Users);
});

////////////////////////////////////////////
///end of modular section
////////////////////////////////////////////

//return the next match(es) information
app.get("/api/nextmatch", function (req, res) {
    var resObj = {
        count: 0,
		rem_predictions:0,
        matchData: [],
        message: "",
        success: false
    };
    //Using isActive column to determine which matches are to be shown
    sqlConn.query(
        "SELECT team1.teamID as t1ID,team1.name as t1Name,team1.group as t1Group, team1.logoURL as t1logoURL, " +
                "team2.teamID as t2ID,team2.name as t2Name, team2.group as t2Group, team2.logoURL as t2logoURL, " +
                "match.matchID as matchID, " +
                "match.isLocked as locked, " +
                "match.MatchDate as date " +
        "FROM " +
            "`match` LEFT JOIN (teams as team1, teams as team2) " +
                    "ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) " +
        "WHERE " +
            "isActive=1",           //todo: use date calculation fu to figure out which is the list of upcoming matches the same day or next day
        { type: sqlConn.QueryTypes.SELECT })
        .then(function (matches) {
        //fill response object and return
        resObj.success = true;
        resObj.count = matches.length;

        for (var n = 0; n < matches.length; n++) {

            //TODO: update query to also select current predictions for user

                resObj.matchData.push({
                    matchID: matches[n].matchID,
                    team1ID: matches[n].t1ID,
                    team1Name: matches[n].t1Name,
                    team1LogoPath: matches[n].t1logoURL,
                    //team1Group: matches[n].t1Group,
                    team2ID: matches[n].t2ID,
                    team2Name: matches[n].t2Name,
                    team2LogoPath: matches[n].t2logoURL,
                    //team2Group: matches[n].t2Group,
                    locked: (matches[n].locked != 0),        //this will enable/disable prediction for particular match
                    date: matches[n].date
                });
            }
        })
        .then(function () {
            //also get remaining number of predictions
            var getRemPredsQRY = "SELECT ((SELECT COUNT(*) FROM users) - COUNT(*)) as rem_preds from prediction p, `match` m WHERE m.matchID = p.matchID AND m.isActive = 1";
            sqlConn.query(getRemPredsQRY,
                {type: sqlConn.QueryTypes.SELECT})
                .then(function (remPredictions) {
                    console.log(JSON.stringify(remPredictions,true));
                    resObj.rem_predictions = remPredictions[0].rem_preds;
                    resObj.success = true;
                    res.json(resObj);
                    res.end();
                })
        })
        .catch(function (err) {
            //match find failed. Reply with message
            utils.logMe("Error trying to fetch match details.Message:\n" + err);
            resObj.success = false;
            resObj.message = err;

            res.json(resObj);
            res.end();
        })
});

//list predictions for upcoming match from submitted players
app.get("/api/getPredictions", function (req, res) {
    var resObj = {
        predictData: [],
        message: "",
        success: false
    };

    var query = "";
    var tokenID = req.query.token;

    //check if match is locked, in which case only return current user's prediction
    Match.find({where: {isActive: 1}})
        .then(function (active_rows) {
            if (active_rows == null) {
                return;
            }

            //union query to show all predictions by player, along with other unhidden predictions
            listPredQRY = "SELECT u.userID, u.name,(SELECT Name FROM teams WHERE teamID = p.predictedTeamID) As PredictedTeam, " +
                        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team1ID) AS team1, " +
                        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team2ID) AS team2 " +
                    "FROM prediction p, users u, teams t, `match` m " +
                    "WHERE p.playerID = u.userID AND u.userID = (SELECT userID from users where auth_key = '" + tokenID + "') AND " +
                        "p.matchID IN (SELECT matchID FROM `match` WHERE isActive =1) AND p.matchID = m.matchID AND " +
                        "t.teamID IN (m.Team1ID, m.Team2ID, 50) AND p.predictedTeamID = t.teamID " +
                    "UNION ALL " +
                    "SELECT u2.userID, u2.name, (SELECT Name FROM teams WHERE teamID = p2.predictedTeamID) AS PredictedTeam, " +
                        "(SELECT teams.Name FROM teams WHERE teams.teamID = m2.Team1ID) AS team1," +
                        "(SELECT teams.Name FROM teams WHERE teams.teamID = m2.Team2ID) AS team2 " +
                    "FROM prediction p2, users u2, teams t2, `match` m2 " +
                    "WHERE p2.playerID = u2.userID AND p2.matchID IN (SELECT matchID FROM `match` WHERE isActive =1 AND isHidden=0) AND " +
                        "p2.matchID = m2.matchID AND t2.teamID IN (m2.Team1ID, m2.Team2ID, 50) AND " +
                        "u2.auth_key <> '" + tokenID + "' AND p2.predictedTeamID = t2.teamID";

            sqlConn.query(listPredQRY,
                {type: sqlConn.QueryTypes.SELECT})
                .then(function (predictions) {
                    var team = '';
                    for (var n = 0; n < predictions.length; n++) {
                        //if draw has been predicted, show competing teams in brackets (so it's more descriptive for multi-game days)
                        team = (predictions[n].PredictedTeam === "DRAW") ? "DRAW (" + predictions[n].team1 + " vs " + predictions[n].team2 + ")" : predictions[n].PredictedTeam;
                        resObj.predictData.push({
                            uid: predictions[n].userID,
                            Name: predictions[n].name,
                            Team: team
                        })
                    }
                    //utils.logMe(JSON.stringify(resObj));
                })
                .then(function () {
                    //also get remaining number of predictions
                    var getRemPredsQRY = "SELECT ((SELECT COUNT(*) FROM users) - COUNT(*)) as rem_preds from prediction p, `match` m WHERE m.matchID = p.matchID AND m.isActive = 1";
                    sqlConn.query(getRemPredsQRY,
                        {type: sqlConn.QueryTypes.SELECT})
                        .then(function (remPredictions) {
                            console.log(JSON.stringify(remPredictions,true));
                            resObj.rem_predictions = remPredictions[0].rem_preds;
                            resObj.success = true;
                            console.log(JSON.stringify(resObj,true));
                            res.json(resObj);
                            res.end();
                        })
                })
                .catch(function (err) {
                    utils.logMe("Error trying to fill in prediction data. Details:\n" + err);
                    resObj.success = false;
                    resObj.message = err;
                    res.json(resObj);
                    res.end();
                })
        })
});

//use routing for all actions
app.use("/api", router);

//check if user has already predicted
app.get("/api/checkIfPredicted", function (req, res) {
    var resObj = {
        message: "",
        hasPredicted: false
    };

    var tokenID = req.query.token;

    sqlConn.query(
        "SELECT * FROM prediction p WHERE playerID = (SELECT userID FROM users WHERE auth_key = '" + tokenID + "') AND matchID IN (SELECT matchID FROM `match` WHERE isActive = 1)",
        {type: sqlConn.QueryTypes.SELECT})
        .then(function (predictionCount) {
            if (predictionCount.length > 0) {
                resObj.hasPredicted = true;
            }
            else {
                resObj.hasPredicted = false;
            }

            res.json(resObj);
            res.end();
            return;
        })
        .catch(function (err) {
            utils.logMe(err);
            resObj.message = err;
            resObj.hasPredicted = true;
            res.json(resObj);
            return;
        })
})

//get user's game history
app.get("/api/getHistory", function (req, res) {
    var resObj = {
        count: 0,
        historyData: [],
        message: "",
        success: false
    };

    var playerToken = req.query.token;
    var historyQuery = "SELECT " +
        "m.MatchDate as match_date," +
        "m.pointsDelta as game_weight, " +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team1ID) as team1," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team2ID) as team2," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = p.predictedTeamID) as predicted_team," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.WinningTeamID) as winning_team " +
        "FROM " +
        "prediction p, users u, teams t, `match` m " +
        "WHERE " +
        "p.playerID = (SELECT userID FROM users WHERE auth_key = '" + playerToken + "' ) AND " +
        "u.userid = p.playerID AND " +
        "t.teamID = p.predictedTeamID AND " +
        "m.matchID = p.matchID AND " +
        "m.isActive=0";

    //console.log(query);

    sqlConn.query(historyQuery, {type: sqlConn.QueryTypes.SELECT})
        .then(function (matches) {

            //fill response object and return
            resObj.success = true;
            resObj.count = matches.length;

            for (var n = 0; n < matches.length; n++) {
                var outcome = (matches[n].predicted_team == null) ? "[TBD]" : ((matches[n].predicted_team == matches[n].winning_team) ? "WIN" : "LOSS");

                resObj.historyData.push({
                    team1Name: matches[n].team1,
                    team2Name: matches[n].team2,
                    matchDate: matches[n].match_date,
                    predictedTeam: matches[n].predicted_team,
                    winningTeam: matches[n].winning_team,
                    points: (matches[n].predicted_team === matches[n].winning_team) ? (matches[n].game_weight) : 0,
                    result: outcome
                });
            }
            //console.log("\n&&&&&USER_HISTORY::\n"+JSON.stringify(resObj)+"\n&&&&&&&&&\n");
            res.json(resObj);
            res.end();
            return;
        })
        .catch(function (err) {
            //match find failed. Reply with message
            utils.logMe("Error trying to fetch user match history. Details:\n" + err);
            resObj.success = false;
            resObj.message = err;

            res.json(resObj);
            res.end();
            return;
        })
});

//get game history of user with req.query.userID
app.get("/api/getHistoryByID", function (req, res) {
    var resObj = {
        count: 0,
        userData: {},
        historyData: [],
        message: "",
        success: false
    };

    var playerID = req.query.userID;
    var historyIDQuery =
        "SELECT " +
        "u.name as player_name, " +
        "u.points as player_points, " +
        "m.MatchDate AS match_date," +
        "m.pointsDelta AS game_weight," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team1ID) AS team1," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team2ID) AS team2," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = p.predictedTeamID) AS predicted_team," +
        "(SELECT teams.Name FROM teams WHERE teams.teamID = m.WinningTeamID) AS winning_team " +
        "FROM prediction p,users u,teams t,`match` m " +
        "WHERE " +
        "p.playerID = " + playerID + " AND " +
        "u.userid = p.playerID AND " +
        "teamID = p.predictedTeamID AND " +
        "m.matchID = p.matchID AND " +
        "m.isActive=0 AND m.isLocked=1 AND m.isHidden=0";

    sqlConn.query(historyIDQuery, {type: sqlConn.QueryTypes.SELECT})
        .then(function (matches) {

            //fill response object and return
            resObj.success = true;
            resObj.count = matches.length;

            resObj.userData['name'] = matches[0].player_name;
            resObj.userData['points'] = matches[0].player_points;

            for (var n = 0; n < matches.length; n++) {
                var outcome = (matches[n].predicted_team == null) ? "[TBD]" : ((matches[n].predicted_team == matches[n].winning_team) ? "WIN" : "LOSS");

                resObj.historyData.push({
                    team1Name: matches[n].team1,
                    team2Name: matches[n].team2,
                    matchDate: matches[n].match_date,
                    predictedTeam: matches[n].predicted_team,
                    winningTeam: matches[n].winning_team,
                    points: (matches[n].predicted_team === matches[n].winning_team) ? (matches[n].game_weight) : 0,
                    result: outcome
                });
            }
            //console.log("\n&&&&&USER_HISTORY::\n"+JSON.stringify(resObj)+"\n&&&&&&&&&\n");
            res.json(resObj);
            res.end();
        })
        .catch(function (err) {
            //match find failed. Reply with message
            utils.logMe("Error trying to fetch user match history. Details:\n" + err);
            resObj.success = false;
            resObj.message = err;

            res.json(resObj);
            res.end();
        })


})

//create/update prediction for user
app.post("/api/submitPrediction", function (req, res) {

    var resObj = {
        message: "",
        success: false
    };

    //utils.logMe("predObj::" + JSON.stringify(req.body.predObj));
    if (!req.body || !req.body.predObj) {
        res.json({Message: "Invalid request, aborting..."});
        return;
    }

    var rows = req.body.predObj.length;
    var userID = 0;
    var team_id = 0;
    var match_id = 0;
    var team_id2 = 0;
    var match_id2 = 0;
    var team_id3 = 0;
    var match_id3 = 0;
    var playerFullName = '';
    var playerEmail = '';

    var match_date = '';
    var selectionList = "";             //list of teams selected by user

    var game_locked_message = "Sorry! Prediction for one (or more) game(s) might not have been added because the game was locked. Please refresh your browser to continue with other predictions.";

    sqlConn.query(
        "SELECT userID, name, email from users WHERE auth_key = '" + req.body.token + "'",
        {type: sqlConn.QueryTypes.SELECT})
        .then(function (user_row) {

            userID = user_row[0].userID;
            team_id = req.body.predObj[0].teamID;
            match_id = req.body.predObj[0].matchID;
            selectionList = "<li><strong>" + req.body.predObj[0].teamName + "</strong></li>";              //add team to selection list

            //fetch the following for sending user details with email
            playerFullName = user_row[0].name;
            playerEmail = user_row[0].email;

            return Match.find({where: {matchID: match_id, isLocked: 0}})
                .then(function (active_rows) {

                    //console.log("returning active rows for match:: %o",active_rows);

                    //check if this match has been locked
                    if (active_rows == null) {

                        utils.logMe("UserID " + userID + " has tried predicting " + match_id + " after lockdown period. This has been logged!");
                        //throw game_locked_message;
                        resObj.message = game_locked_message;
                        resObj.success = false;
                        return resObj;
                    }
                    match_date = active_rows.MatchDate;
                    //not locked, so prediction change is allowed
                    return Prediction
                        .findOrCreate({
                            where: {playerID: userID, matchID: match_id},
                            defaults: {predictedTeamID: team_id}
                        })
                        .spread(function (prediction, created) {
                            if (!created) {
                                //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id);
                                //console.log("EXISTING prediction object:" ,prediction);

                                //prediction exists; update it
                                sqlConn.query(
                                    "UPDATE prediction SET predictedTeamID=" + team_id + " WHERE playerID=" + userID + " AND matchID=" + match_id,
                                    {type: sqlConn.QueryTypes.UPDATE})
                                    .then(function (updated) {
                                        utils.logMe("Updated for user " + userID + " for matchID: " + match_id + "; new team: " + team_id);
                                        //console.log(JSON.stringify(updated));
                                        //send email confirming change
                                        //utils.sendConfirmation(new Date(),"You have updated your team to ??????????????????????????????????????????????????????","Khal Drogo",'grv2k6@gmail.com');
                                        resObj.success = true;
                                    })
                            }
                            else {
                                //new row has been created
                                utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id + "; new team: " + team_id);
                                resObj.success = true;
                            }
                        });

                    //return resObj;
                    resObj.success = true;
                })
                .catch(function (err) {
                    //console.log("\n\nCAUGHT, NOW RETURNING resObj!");
                    //throw err;
                    utils.logMe("PREDICTION_EXCEPTION::" + err);
                    resObj.message = err;
                    resObj.success = false;
                    res.json(resObj);
                })
        })
        .then(function () {
            //utils.logMe("userID from second row is: " + userID);
            if (rows > 1) {
                //update second game if exists
                team_id2 = req.body.predObj[1].teamID;
                match_id2 = req.body.predObj[1].matchID;
                selectionList = selectionList + "<li><strong>" + req.body.predObj[1].teamName + "</strong></li>";
                ;              //add team to selection list

                Match.find({where: {matchID: match_id2, isLocked: 0}})
                    .then(function (active_rows) {
                        //check if this match has been locked
                        if (active_rows == null) {
                            utils.logMe("UserID " + userID + " has tried predicting matchID " + match_id2 + " after lockdown period. This has been logged!");
                            //throw "Sorry, the game has been locked! Prediction is not allowed at this time.";
                            resObj.message = game_locked_message;
                            resObj.success = false;
                            return resObj;
                        }
                        //not locked, so prediction change is allowed
                        return Prediction
                            .findOrCreate({
                                where: {playerID: userID, matchID: match_id2},
                                defaults: {predictedTeamID: team_id2}
                            })
                            .spread(function (prediction2, created) {
                                if (!created) {
                                    //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id2);
                                    //utils.logMe("EXISTING prediction object:" + JSON.stringify(prediction2));

                                    //prediction exists; update it
                                    sqlConn.query(
                                        "UPDATE prediction SET predictedTeamID=" + team_id2 + " WHERE playerID=" + userID + " AND matchID=" + match_id2,
                                        {type: sqlConn.QueryTypes.UPDATE})
                                        .then(function (updated2) {
                                            utils.logMe("Updated for user " + userID + " for matchID: " + match_id2);
                                            resObj.success = true;
                                        })
                                }
                                else {
                                    //new row has been created
                                    utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id2);
                                    resObj.success = true;
                                }
                            })
                    })
                    .catch(function (err) {
                        //utils.logMe("PRED_EXCEPTION::" + err);
                        resObj.message = err;
                        resObj.success = false;
                        res.json(resObj);
                        return;
                    })
            }
            res.json(resObj);
            return;
        })
        .then(function () {
            if (rows > 2) {
                //update second game if exists
                team_id3 = req.body.predObj[2].teamID;
                match_id3 = req.body.predObj[2].matchID;
                selectionList = selectionList + "<li><strong>" + req.body.predObj[2].teamName + "</strong></li>";              //add team to selection list

                Match.find({where: {matchID: match_id3, isLocked: 0}})
                    .then(function (active_rows) {
                        //check if this match has been locked
                        if (active_rows == null) {
                            utils.logMe("UserID " + userID + " has tried predicting matchID " + match_id3 + " after lockdown period. This has been logged!");
                            //throw "Sorry, the game has been locked! Prediction is not allowed at this time.";
                            resObj.message = game_locked_message;
                            resObj.success = false;
                            return resObj;
                        }
                        //not locked, so prediction change is allowed
                        return Prediction
                            .findOrCreate({
                                where: {playerID: userID, matchID: match_id3},
                                defaults: {predictedTeamID: team_id3}
                            })
                            .spread(function (prediction3, created) {
                                if (!created) {
                                    //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id2);
                                    //utils.logMe("EXISTING prediction object:" + JSON.stringify(prediction2));

                                    //prediction exists; update it
                                    sqlConn.query(
                                        "UPDATE prediction SET predictedTeamID=" + team_id3 + " WHERE playerID=" + userID + " AND matchID=" + match_id3,
                                        {type: sqlConn.QueryTypes.UPDATE})
                                        .then(function (updated3) {
                                            utils.logMe("Updated for user " + userID + " for matchID: " + match_id3);
                                            resObj.success = true;
                                        })
                                }
                                else {
                                    //new row has been created
                                    utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id3);
                                    resObj.success = true;
                                }
                            })
                    })
                    .catch(function (err) {
                        //utils.logMe("PRED_EXCEPTION::" + err);
                        resObj.message = err;
                        resObj.success = false;
                        res.json(resObj);
                        return;
                    })
            }
            //res.json(resObj);
            //return;
        })
        .then(function () {
            if (rows > 3) {
                //update second game if exists
                team_id4 = req.body.predObj[3].teamID;
                match_id4 = req.body.predObj[3].matchID;
                selectionList = selectionList + "<li><strong>" + req.body.predObj[3].teamName + "</strong></li>";              //add team to selection list

                Match.find({where: {matchID: match_id4, isLocked: 0}})
                    .then(function (active_rows) {
                        //check if this match has been locked
                        if (active_rows == null) {
                            utils.logMe("UserID " + userID + " has tried predicting matchID " + match_id4 + " after lockdown period. This has been logged!");
                            //throw "Sorry, the game has been locked! Prediction is not allowed at this time.";
                            resObj.message = game_locked_message;
                            resObj.success = false;
                            return resObj;
                        }
                        //not locked, so prediction change is allowed
                        return Prediction
                            .findOrCreate({
                                where: {playerID: userID, matchID: match_id4},
                                defaults: {predictedTeamID: team_id4}
                            })
                            .spread(function (prediction4, created) {
                                if (!created) {
                                    //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id2);
                                    //utils.logMe("EXISTING prediction object:" + JSON.stringify(prediction2));

                                    //prediction exists; update it
                                    sqlConn.query(
                                        "UPDATE prediction SET predictedTeamID=" + team_id4 + " WHERE playerID=" + userID + " AND matchID=" + match_id4,
                                        {type: sqlConn.QueryTypes.UPDATE})
                                        .then(function (updated4) {
                                            utils.logMe("Updated for user " + userID + " for matchID: " + match_id4);
                                            resObj.success = true;
                                        })
                                }
                                else {
                                    //new row has been created
                                    utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id4);
                                    resObj.success = true;
                                }
                            })
                    })
                    .catch(function (err) {
                        //utils.logMe("PRED_EXCEPTION::" + err);
                        resObj.message = err;
                        resObj.success = false;
                        res.json(resObj);
                        return;
                    })
            }
            //res.json(resObj);
            //return;
        })
        .then(function () {
            //notify user via email about submission confirmation
            utils.sendConfirmation(match_date, "<p><strong>You have updated your prediction to:</strong></p><ul>" + selectionList + "</ul>", playerFullName, playerEmail);
        })
        .catch(function (err) {
            //utils.logMe("PRED_EXCEPTION::" + err);
            resObj.message = err;
            resObj.success = false;
            return resObj;
        })

});

app.get("/api/uTestEmail", function (req, res) {
    utils.sendConfirmation(new Date(), "You have chosen England as your team", "Khal Drogo", 'grv2k6@gmail.com');
    res.json({message: 'OK'});
})

app.get("/api/testNextMatch", function (req, res) {
    var resObj = {
        count: 0,
        matchData: [],
        message: "",
        success: false
    };

    var nextMatchDay = utils.getTomorrowsDate();
    console.log("Next day is: " + nextMatchDay);

    res.json({message: 'OK'});
    // sqlConn.query(
    //     "SELECT team1.teamID as t1ID,team1.name as t1Name,team1.group as t1Group, team1.logoURL as t1logoURL, team2.teamID as t2ID,team2.name as t2Name, team2.group as t2Group, team2.logoURL as t2logoURL, match.matchID as matchID, match.isLocked as locked, match.MatchDate as date FROM `match` LEFT JOIN (teams as team1, teams as team2) ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) WHERE isActive=1",
    //     { type: sqlConn.QueryTypes.SELECT })
    //     .then(function (matches) {
    //         //fill response object and return
    //         resObj.success = true;
    //         resObj.count = matches.length;
    //
    //         for (var n = 0; n < matches.length; n++) {
    //
    //             //TODO: update query to also select current predictions for user
    //
    //             resObj.matchData.push({
    //                 matchID: matches[n].matchID,
    //                 team1ID: matches[n].t1ID,
    //                 team1Name: matches[n].t1Name,
    //                 team1LogoPath: matches[n].t1logoURL,
    //                 //team1Group: matches[n].t1Group,
    //                 team2ID: matches[n].t2ID,
    //                 team2Name: matches[n].t2Name,
    //                 team2LogoPath: matches[n].t2logoURL,
    //                 //team2Group: matches[n].t2Group,
    //                 locked: (matches[n].locked == 0)?false:true,        //this will enable/disable prediction for particular match
    //                 date: matches[n].date
    //             });
    //         }
    //         res.json(resObj);
    //         res.end();
    //     })
    //     .catch(function (err) {
    //         //match find failed. Reply with message
    //         utils.logMe("Error trying to fetch match details.Message:\n" + err);
    //         resObj.success = false;
    //         resObj.message = err;
    //
    //         res.json(resObj);
    //         res.end();
    //     })


})

/*=====================================Admin functions===============================*/

app.get("/api/adminUpdateScores", function (req, res) {
    var resObj = {
        message: "",
        success: false
    };

    var playerToken = req.query.token;
    var matchID = req.query.matchID;
    var winningTeamID = req.query.winningTeamID;
    var scoreIncBy = req.query.scoreIncBy;

    //check if admin user
    sqlConn.query(
        "SELECT * FROM users WHERE auth_key = '" + playerToken + "' AND isAdmin = 1",
        {type: sqlConn.QueryTypes.SELECT})
        .then(function (isAdmin) {

            if (!isAdmin) {
                //not an admin
                resObj.message = "Specified user is not an admin";
                resObj.success = false;
                res.json(resObj);
                res.end();
            }

            //TODO:: success....now update the scores list
            utils.logMe("This is where teamID " + winningTeamID + " is to be updated as winner for matchID " + matchID + ", and score will be incremented by " + scoreIncBy);
        })
        .catch(function (err) {
            utils.logMe("Error trying to update scores for user " + req.query.token + ". Details:\n" + err);
            resObj.message = "Error trying to update scores. Details: " + err;
            resObj.success = false;
            res.json(resObj);
            res.end();
            return;
        })
})

/*=====================================Init app=====================================*/

app.listen(port);

utils.logMe(nofapp + " started on port " + port);