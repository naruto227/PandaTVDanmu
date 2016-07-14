/**
 * Created by hzq on 16-7-12.
 */
var net = require('net');
var message = require('./message');
exports.start = function (roomid, chatInfo) {
    try {

        var s = net.connect({
            port: chatInfo['socketPort'],
            host: chatInfo['socketIP']
        }, function () {
            console.log('connect success');
        });
        // http://www.panda.tv/ajax_chatroom?roomid=15053&_=1454038739756
//http://api.homer.panda.tv/chatroom/getinfo?rid=-68203369&roomid=15053&retry=0&sign=409c8db9d22c4ba51a7417f740c1cfc5&ts=1468296039222

        var msg = 'u:' + chatInfo['rid']
            + '@' + chatInfo['appid']
            + '\nk:1\nt:300\nts:' + chatInfo['ts']
            + '\nsign:' + chatInfo['sign']
            + '\nauthtype:' + chatInfo['authtype'];
        message.sendData(s, msg);

        var completeMsg = [];
        s.on('data', function (chunk) {
            completeMsg.push(chunk);
            chunk = Buffer.concat(completeMsg);
            if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 6) {
                console.log('login');
                completeMsg = [];
            } else if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 3) {
                var msg = message.getMsg(chunk);
                if (msg[0].length < msg[1]) {
                    console.log('parted');
                } else {
                    message.analyseMsg(roomid, msg[0]);
                    completeMsg = [];
                }
            } else if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 1) {
                console.log('keepalive');
                completeMsg = [];
            } else {
                console.log('error');
                console.log(chunk);
                completeMsg = [];
            }
        });

        setInterval(function () {
            message.sendKeepalive(s);
        }, 200000);
    }catch (e){
        console.log(e.message);
    }

}