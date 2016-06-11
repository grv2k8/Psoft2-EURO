// (C)grjoshi 5/29/2016
// userModule.js - User related functions
var utils = require("./PS2Utils.js");
var exports = module.exports = {};

//API function implementation
exports.logIn = function (req,res,userModel) {

    var resObj = {
        usrData: {},
        message: "",
        success: false
    };

    if (req.body.email == "" || req.body.password == "") {
        resObj.message = "Invalid email/password";
        resObj.success = false;
    }
    userModel.find({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    })
        .then(function (usrObj) {

            if (usrObj == null) {
                throw "User not found. Please check username/password and try again";
            }

            //populate user data
            resObj.success = true;
            resObj.usrData = {
                //userID: usrObj.userID,            //not sending this due to security concerns (token should suffice)
                email: usrObj.email,
                name: usrObj.name,
                token: usrObj.auth_key,
                points: usrObj.points
            };

            res.json(resObj);
            res.end();
            return;
        })
        .catch(function (err) {
            //user find failed
            utils.logMe("Error trying to fetch user with email " + req.body.email + ". Details: " + err);
            resObj.success = false;
            resObj.message = err;

            res.json(resObj);
            res.end();
            return;
        });
};

exports.addUser = function(req,res,userModel){
    /////////uncomment the following after registration period expires
    utils.logMe("Registration period has expired. Unable to register account for " + req.body.email);
    res.json({ success: false, message: "Registration period has ended. New accounts will not be added!" });
    return;
    /////////////////////////////////////////

    //Password hashing has been taken care of on the client side
    if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
        utils.logMe("Blank values trying to add user(email given: " + req.body.email + "). Not registering!");
        return;
    }

    var resObj = {
        message: "",
        success: false
    };


    //check if email ID already exists
    userModel.find({
        where: {
            email: req.body.email,
        }
    }).then(function (usrObj) {
        if (usrObj == null) {
            //email has not been taken; add this user
            var user = userModel.build({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,        //hash at client side
                auth_key: req.body.token,
                points: 0
            });

            user.save()
                .then(function () {
                    utils.logMe('*** Added user with email: '+req.body.email);
                    resObj.success = true;
                    resObj.message = "Successfully created new user account";
                    res.json(resObj);
                    return;
                })
                .catch(function (err) {
                    utils.logMe("Error adding user {" + req.body.name + "/" + req.body.email + "/" + "}. Details: \n" + err + ")");
                    resObj.success = false;
                    resObj.message = err;
                    res.json(resObj);
                    return;
                });
        }
        else {
            throw "That email address has already been registered.";
        }
    })
        .catch(function (err) {
            utils.logMe("[" + req.body.email + "]" + err);
            resObj.success = false;
            resObj.message = err;
            res.json(resObj);
            return;
        });
};