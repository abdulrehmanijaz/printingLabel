var express = require("express");
var router = express.Router();
var passport = require("passport");
const mysql = require("../../../controllers/mysqlCluster.js");
var response = {};
var Cookies = require("js-cookie");
var QRCode = require('qrcode');
const { createCanvas, loadImage } = require("canvas");

var now = new Date();

const path = require('path');

if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

router.post('/getuserDetails',authenticationMidleware(), (req, res, next) => {
    var session = req.session;
    res.end(JSON.stringify(session.username)); 

})

router.post('/GetSerialNumber', authenticationMidleware(), (req, res, next) => {

    var select_query = "SELECT last_serial_no_val,plant_ref,plant_no FROM last_serial_no"   
    
    mysql.queryCustom(select_query).then(function(result) {
        if (result.status == "1") {
            res.end(JSON.stringify(result.results));
        } else {
           
        }
    }).catch(function(error) {
       
    });        

});


router.post('/ReprintingRequest', (req, res, next) => {
   
  
    async function create(dataForQRcode, center_image, width, cwidth) {
        const canvas = createCanvas(width, width);
        QRCode.toCanvas(
            canvas,
            dataForQRcode,
            {
                errorCorrectionLevel: "H",
                margin: 1,
                height:800,
                width:800,
                color: {
                dark: "#000000",
                light: "#ffffff",
                },
            }
        );

        const ctx = canvas.getContext("2d");

        ctx.moveTo(10.5, 0);
        ctx.lineTo(10.5, 30);


        const img = await loadImage(center_image);

        ctx.drawImage(img, 315, 305, 182 ,182);
      
        return canvas.toDataURL("image/png");
    }


    function pad_with_zeroes(number,length) {

        var my_string_split =  number;

        var string_length = number.length;

        var new_string = '';
      
        var length2 = length;

        for(var i = string_length; i<length2;i++){
           
            new_string += '0'
        }
        
        return new_string;
    }

    function padLeadingZeros(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
   

        

    var session         = req.session;
    var qty             = req.body.qty;
    var plant_ref       = req.body.plantref
 
    var plant_no        = req.body.plantNo;
    var plant_ref_full  = plant_ref+plant_no;

    
    var select          = "SELECT reference_value FROM reference_table";

   
    var reference_value     = '';
    var reference_value_z   = '';
    var plant_no_q          = '';
 
    var current_year = new Date().getFullYear().toString().substr(-2);
    var user_name = session.username;
    var value_zerro='';
    var insert_serieal_new ='';
    var total_ress='';
    var total_res='';
    var update_Query ='';
    var last_insert_serial='';
    var insert_serieal_num = req.body.serialno;

   
     


    mysql.queryCustom(select).then(function(result) {
        if (result.status == "1") {

            reference_value     =   result.results[0].reference_value;

         
            var update_unique = "UPDATE `reference_table` SET `reference_value` = reference_value+"+qty
            mysql.queryCustom(update_unique).then(function(result) {});

            


             
            async function main(reference_value22,plant_ref_full) {
                var reference_value =0;
                reference_value     =reference_value22;
                
                var print_query         =  'INSERT INTO print_qr(plant_no , plant_ref ,ref_id,status,serial_no, qty , user_name) VALUES ' 
        

                for (var k = 1; k<= qty; k++) 
                {

               
                    plant_no_q          =   plant_no;
                    
                    reference_value11 = reference_value;
                    
                  
                    if(k==qty)
                    {
                        
                        print_query += '("'+plant_no+'", "'+plant_ref+'","'+reference_value11+'","reprinting","'+insert_serieal_num+'" , "'+qty+'" , "'+user_name+'");'
                       
                        last_insert_serial=insert_serieal_num;
                    }
                }//main for loop end here

                update_Query = "update last_serial_no set "+ 
                        " plant_ref = '"+plant_ref+"',  plant_no = '"+plant_no_q+"',year='"+current_year+"',"+ 
                        " last_serial_no_val = '"+insert_serieal_num+"' ,ref_no='"+reference_value11+"';";

                       
                mysql.queryCustom(update_Query).then(function(result){
                    //console.log(result)

                }).catch(function(error){
                    
                    console.log(error);
                });

                console.log(print_query);
                mysql.queryCustom(print_query).then(function(result) {
                    //console.log(result);
                }).catch(function(error) {
                    
                    console.log(error);
                });


                var plant_ref_full=plant_ref_full; 
                var abc = insert_serieal_num;
                const qrCode = await create(
                    abc,
                    "https://#/logo_new.jpg",
                    800,
                    100  
                );
                //parseInt(qty*4)

                for (var i = 1; i<= parseInt(qty); i++) {
                    
                   

                    total_res = total_res+`
                        <div style="max-width:700px;height:auto;text-align:center; overflow:hidden">

                            <div style="font-size:50px;">
                                <p  style="margin-bottom:20px ; margin-top:20px">`+plant_ref_full+`</p>
                            </div>

                            <div>
                                <img src="`+qrCode+`" width="100%" height="auto">
                            </div>
                            
                           
                           
                            <div style="font-size:50px;">    
                                <p  style="margin-bottom:20px ; margin-top:20px">`+insert_serieal_num+`</p>
                            </div>    
                        </div>
                        <footer></footer>
                        `;
                
                }
                res.send(last_insert_serial+"|^***^|"+total_res);

            }
            main(reference_value,plant_ref_full);
            


        }else{

        }
    })
       
      
   
});


//authenticationMidleware(), 
router.post('/PrintForm', (req, res, next) => {
   
   

    async function create(dataForQRcode, center_image, width, cwidth) {
        const canvas = createCanvas(width, width);
        QRCode.toCanvas(
            canvas,
            dataForQRcode,
            {
                errorCorrectionLevel: "H",
                margin: 1,
                height:800,
                width:800,
                color: {
                dark: "#000000",
                light: "#ffffff",
                },
            }
        );

        const ctx = canvas.getContext("2d");

        ctx.moveTo(10.5, 0);
        ctx.lineTo(10.5, 30);


        const img = await loadImage(center_image);

        ctx.drawImage(img, 315, 305, 182 ,182);
      
        return canvas.toDataURL("image/png");
    }


    function pad_with_zeroes(number,length) {

        var my_string_split =  number;

        var string_length = number.length;

        var new_string = '';
      
        var length2 = length;

        for(var i = string_length; i<length2;i++){
           
            new_string += '0'
        }
        
        return new_string;
    }

    function padLeadingZeros(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
   

        

    var session         = req.session;
    var qty             = req.body.qty;
    var plant_ref       = req.body.plantref
 
    var old_plant_no    = req.body.plantNo;
    var plant_no        = '971'+old_plant_no;

    var plant_ref_full  = plant_ref+plant_no;

    
    var select          = "SELECT reference_value FROM reference_table";

   
    var reference_value     = '';
    var reference_value_z   = '';
    var plant_no_q          = '';
    var insert_serieal_num  = '';
    var current_year = new Date().getFullYear().toString().substr(-2);
    var user_name = session.username;
    var value_zerro='';
    var insert_serieal_new ='';
    var total_ress='';
    var total_res='';
    var update_Query ='';
    var last_insert_serial='';

   
     


    mysql.queryCustom(select).then(function(result) {
        if (result.status == "1") {

            reference_value     =   result.results[0].reference_value;

            /*updating reference according to qty*/
            var update_unique = "UPDATE `reference_table` SET `reference_value` = reference_value+"+qty
            mysql.queryCustom(update_unique).then(function(result) {});

          


             
            async function main(reference_value22,plant_ref_full) {
                var reference_value =0;
                reference_value     =reference_value22;
               
                for (var k = 1; k<= qty; k++) 
                {
                   
                   
                    
                    reference_value     = reference_value+1;
                    
                    plant_no_q          =   plant_no;
                    
                    s_num               =   plant_no+current_year;
                    padding_req         =   20-parseInt(s_num.length);

                   

                    reference_value_z   = padLeadingZeros(reference_value,padding_req);
                    insert_serieal_num  = (s_num).toString()+(reference_value_z).toString();
                   


                    // console.log("===reference_value >>"+reference_value);
                    // console.log("===plant_no_q >>"+plant_no);
                    //  console.log("===padding_req >>"+padding_req);
                    // console.log("===reference_value_z >>"+reference_value_z);
                    //console.log("===insert_serieal_num >>"+(insert_serieal_num));
                    // console.log("===reference_value_z >>"+reference_value_z);
                    last_insert_serial=insert_serieal_num;
                    if(k==qty)
                     {
                        /*-------------------------------------------------------*/
                        update_Query = "update last_serial_no set "+ 

                        " plant_ref = '"+plant_ref+"',  plant_no = '"+plant_no_q+"',year='"+current_year+"',"+ 
                        " last_serial_no_val = '"+(insert_serieal_num).toString()+"' ,ref_no='"+reference_value+"'";
                        //console.log(update_Query);
                        mysql.queryCustom(update_Query).then(function(result){})


                        /*-------------------------------------------------------*/
                        var print_query =  'INSERT INTO print_qr(plant_no , plant_ref ,ref_id,status,serial_no, qty , user_name) VALUES ' 
        
                        print_query += '("'+plant_no+'", "'+plant_ref+'" ,"'+reference_value+'","printing","'+insert_serieal_num+'", "'+qty+'" , "'+user_name+'");'
                       // console.log(print_query);
                        mysql.queryCustom(print_query).then(function(result) {

                        }).catch(function(error) {

                        });
                        
                    }
                    total_ress = total_ress+insert_serieal_num+"========";
                 
                   // console.log(insert_serieal_new);
                  
                       
                        var plant_ref_full=plant_ref_full; 
                        var abc = insert_serieal_num;
                        const qrCode = await create(
                            abc,
                            "https://devnew.azurewebsites.net/assets/images/logo_new3.jpg",
                            800,
                            100  
                        );
                        //parseInt(qty*4)
                        for (var i = 1; i<= 5; i++) {
                            
                           
                            total_res = total_res+`
                                <div style="max-width:700px;height:auto;text-align:center; overflow:hidden">

                                    <div style="font-size:50px;">
                                        <p  style="margin-bottom:20px ; margin-top:20px">`+plant_ref_full+`</p>
                                    </div>

                                    <div>
                                        <img src="`+qrCode+`" width="100%" height="auto">
                                    </div>
                                    
                                   
                                   
                                    <div style="font-size:50px;">    
                                        <p  style="margin-bottom:20px ; margin-top:20px">`+insert_serieal_num+`</p>
                                    </div>    
                                </div>
                                <footer></footer>
                                `;
                        
                        }

                   
                 
        

                }//main for loop end here
                res.send(last_insert_serial+"|^***^|"+total_res);

            }
            main(reference_value,plant_ref_full);
            


        }else{

        }
    })
       
      
   
});



//logouttttttttttttttttttttttt
router.get('/logout', (req, res, next) => {
    try {
        var session = req.session;
        
        req.session.destroy(function(err) {

            return res.redirect(process.env.SITE_LINK + '/login');
        })
    } catch (e) {
        console2.log('Error', 'Catch Exception', '1512-logout  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1519-CountExecutiveSummary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

function onAuthorizeSuccess(data, accept) {
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    accept(null, false);
}

function authenticationMidleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}
module.exports = router;