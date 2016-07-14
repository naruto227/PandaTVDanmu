/**
 * Created by hzq on 16-7-12.
 */
var request = require("request");
var config = require('../config');

exports.uploadServe = function (room_id, paltform, data) {
    var options = {
        headers: {"Connection": "close"},
        url: config.upload.uploadurl + "dmPandatv" +
        "?room_id=" + room_id,
        /*url: "http://localhost:2999/" +  "dmPandatv" +
         "?room_id=" + room_id,*/
        method: 'POST',
        json: true,
        body: {msg: data}
    };

    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log('----info------', data);

        }else {
            console.log(error.message)
        }
    }

    request(options, callback);
    console.log(room_id + "******" + JSON.stringify({msg: data}));
};