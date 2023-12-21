const mysql = require("./mysqlCluster.js");
//const logger = require('pino')()
const pino = require('pino')
const logger = pino({
  prettyPrint: true
})

function log(type,system_msg,custom_msg) {
    var dataType = '';
    var system_msg_db = '';
    var custom_msg_db = '';

    //console.log(data);
    if (typeof type !== 'undefined') {
        dataType = type;
    }

  
    if (typeof system_msg !== 'undefined') {
        system_msg_db = system_msg;
    }

    if (typeof custom_msg !== 'undefined') {
        custom_msg_db = custom_msg;
    }


    if(dataType !== '' || system_msg_db !== '' || custom_msg_db !== ''){

        var new_query = "INSERT INTO `logs`" +
            "(`type` ,`system_msg`,`custom_msg`) " +
            "VALUES " +
            "('" + escape(type) + "',"+ 
            "'"+escape(system_msg_db)+"','"+escape(custom_msg_db)+"')";
            
          
           

            if(dataType=="Error")
            {
                 logger.error(custom_msg_db+system_msg_db);
            }
            else if(dataType=="Error")
            {
                 logger.info(custom_msg_db+system_msg_db);
            }
            else
            {
                 logger.info(custom_msg_db+system_msg_db);
            }
        // mysql.queryCustom(new_query).then(function(result) {
        //     if (result.status == "1") {
        //         console.log(dataType);
        //     } else {
        //         console.log('Error')
        //     }
        // })
        // .catch(function(error) {
        //     console.log(error);
        // });
    }else{
        console.log(dataType);
    }
}

module.exports.log = log;