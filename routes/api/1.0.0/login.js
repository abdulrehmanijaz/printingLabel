var express = require("express");
var router = express.Router();
const mysql = require("../../../controllers/mysqlCluster.js");
var passport = require("passport");
var bcrypt = require('bcryptjs');
var response = {};
const rateLimit = require("express-rate-limit");
var dateFormat = require("dateformat");
var dateFormat = require("dateformat");
var now = new Date();
var datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

const LimitingMiddleware = require("../../../controllers/login_Limit.js");



router.use(new LimitingMiddleware({ limit: 5, resetInterval: 900000 }).limitByIp());


router.post('/web_login2', (req, res, next) => {
   // const remaining = req.rateLimit.remaining;


    var username = req.body.username;
    var password = req.body.password;
    var token = req.body.token;

    if (username !== '' && username !== undefined && password !== '' &&
        password !== undefined && token !== undefined && token !== '') {


        if (password == '' || username == '') {

            res.status(400).send({
                error: "1",
                message: "Both username and password required",
            });
            return
        }

       
        if (token == 123456) {
           
            mysql.querySelect("users", "where username = '" + username + "'", "*")
                .then(function(result) {
                    
                    if (result.status == "1") {
                        if (result.results.length > 0) {
                            var user_id = result.results[0].id;
                            bcrypt.compare(password, result.results[0].password, function(err, result2) {
                                
                                if (result2) {
                                    var new_query = "SELECT * FROM users US " +
                                        "WHERE US.id = '" + user_id + "'"
                                    
                                    mysql.queryCustom(new_query).then(function(result22) {

                                           
                                            if (result.status == "1") {

                                                req.session.user_id = user_id;
                                              
                                                req.session.username = result22.results[0].username;
                                                

                                                req.login(user_id, function(err) {
                                                    if (err) {

                                                       
                                                        res.status(400).send(
                                                            "Uknown Error Logging In 1"
                                                        );
                                                    } else {

                                                        var update_login_time = "update users set `last_login`= '" + datetime + "' " +
                                                            " where id = '" + user_id + "'"

                                                        mysql.queryCustom(update_login_time).then(function(result) {
                                                            if (result.status == "1") {

                                                                res.status(200).send({
                                                                    error:"0",
                                                                    message:"Logged in Successfully"
                                                                });
                                                            } else {

                                                                res.status(400).send(
                                                                    "Uknown Error Logging In 2"
                                                                );

                                                            }
                                                        })

                                                    }
                                                });
                                            } else {

                                                
                                                res.status(400).send(
                                                    "Uknown Error Logging In 3"
                                                );

                                            }
                                        })
                                        .catch(function(error) {

                                            
                                            res.end(error);
                                        
                                        });

                                } else {


                                    res.status(400).send(
                                        //`You have ${remaining} remaining attempts `
                                         "Your Username or Password is incorrect"
                                    );

                                }
                            });
                        } else {

                            res.status(400).send(
                                "Username does not exist"
                            ); 

                        }

                    } else {
                        
                        res.status(400).send(
                            "Error Logg In"
                        );

                    }
                })
                .catch(function(error) {
                   
                    res.json(JSON.stringify(response));
                })
        } else {

            res.status(400).send(
              "Invalid Token"
            );
        }
    } else {

        res.status(400).send(
            "Field Is missing !"
        );
    }

});


passport.serializeUser(function(userName, done) {
    done(null, userName);
});

passport.deserializeUser(function(userName, done) {
    done(null, userName);
});

//Handle Invalid Command
router.post('/*', (req, res, next) => {
    response['error'] = '1';
    response['message'] = 'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});

router.get('/*', (req, res, next) => {
    response['error'] = '1';
    response['message'] = 'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});
module.exports = router;