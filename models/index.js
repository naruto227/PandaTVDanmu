/**
 * Created by hzq on 16-7-12.
 */
// var events = require('events');
var http = require('http');
// var util = require('util');
var request = require('request');
var chat = require('./net/chat');
/*function getChatInfo(roomid) {
 this.roomid = roomid;
 }*/
// util.inherits(getChatInfo, events.EventEmitter);

exports.getChatInfo = function (roomid) {
    console.log(roomid);
    http.get('http://www.panda.tv/ajax_chatinfo?roomid=' + roomid, function (res) {
        // request('http://www.panda.tv/ajax_chatinfo?roomid=' + roomid, function (res) {

        res.on('data', function (chunk) {
            try {
                var json = JSON.parse(chunk);
                var jsonData = json.data;
                var chatAddr = jsonData.chat_addr_list[0];
                var socketIP = chatAddr.split(':')[0];
                if('111.206.247.203'==socketIP){
                    console.log(roomid + ": " + socketIP);
                    return;
                }
                var socketPort = chatAddr.split(':')[1];
                var rid = jsonData.rid;
                var appid = jsonData.appid;
                var authtype = jsonData.authtype;
                var sign = jsonData.sign;
                var ts = jsonData.ts;
                //console.log(socketIP, socketPort, rid, appid, authtype, sign, ts);

                var chatInfo = {
                    "socketIP": socketIP,
                    "socketPort": socketPort,
                    "rid": rid,
                    "appid": appid,
                    "authtype": authtype,
                    "sign": sign,
                    "ts": ts
                };
                chat.start(roomid,chatInfo);
            }
            catch (e) {

            }
        });

    });

};

// module.exports = getChatInfo;