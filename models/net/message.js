var upload = require('../upload');
var mydata = [];

exports.sendData = function (s, msg) {
    try {
        var data = new Buffer(msg.length + 6);
        data.writeInt16BE(6, 0);
        data.writeInt16BE(2, 2);
        data.writeInt16BE(msg.length, 4);
        data.write(msg, 6);
        s.write(data);
    } catch (e) {

    }

};

exports.sendKeepalive = function (s) {
    try {
        var data = new Buffer(4);
        data.writeInt16BE(6, 0);
        data.writeInt16BE(0, 2);
        s.write(data);
    } catch (e) {

    }

};

exports.getMsg = function (chunk) {
    try {
        var msgLen = chunk.readInt16BE(4);
        var msg = chunk.slice(6, 6 + msgLen);
        var offset = 6 + msgLen;
        msgLen = chunk.readInt32BE(offset);
        offset += 4;
        msgInfo = [];
        msgInfo.push(chunk.slice(offset, offset + msgLen));
        msgInfo.push(msgLen);
        return msgInfo;
    } catch (e) {

    }

};

exports.analyseMsg = function (roomid, totalMsg) {
    try {
        while (totalMsg.length > 0) {
            var IGNORE_LEN = 12;
            totalMsg = totalMsg.slice(IGNORE_LEN);
            var msgLen = totalMsg.readInt32BE(0);
            var msg = totalMsg.slice(4, 4 + msgLen);
            formatMsg(roomid, msg);
            // console.log('*******' + msg);
            totalMsg = totalMsg.slice(4 + msgLen);
        }
    } catch (e) {

    }

};

function formatMsg(roomid, msg) {
    try {
        var DANMU_TYPE = '1';
        var BAMBOO_TYPE = '206';
        var AUDIENCE_TYPE = '207';
        var TU_HAO_TYPE = '306';
        /*var MANAGER = '60';
         var SP_MANAGER = '120';
         var HOSTER = '90';*/
        msg = JSON.parse(msg);
        msg.ctime = new Date().getTime();
        mydata.push(msg);
        if (mydata.length > 20) {
            // console.log(JSON.stringify(mydata));
            upload.uploadServe(roomid, "pandatv", mydata);
            mydata = [];
        }
       /* var content = msg.data.content;
        if (msg.type == DANMU_TYPE) {
            // var identity = msg.data.from.identity;
            var nickName = msg.data.from.nickName;
            /!*if (msg.data.from.sp_identity == SP_MANAGER) {
             nickName = '*超管*' + nickName;
             }
             if (identity == MANAGER) {
             nickName = '*房管*' + nickName;
             } else if (identity == HOSTER) {
             nickName = '*主播*' + nickName;
             }*!/
            // console.log(roomid + nickName + ':' + content);
        } else if (msg.type == BAMBOO_TYPE) {
            nickName = msg.data.from.nickName;
            console.log(roomid + nickName + '送给主播[' + content + ']个竹子');
        } else if (msg.type == TU_HAO_TYPE) {
            nickName = msg.data.from.nickName;
            price = msg.data.content.price;
            console.log(roomid + '*******' + nickName + '送给主播[' + price + ']个猫币' + '*******');
        } else if (msg.type == AUDIENCE_TYPE) {
            console.log(roomid + '==========观众人数' + content + '==========');
        }*/
    } catch (e) {

    }


}
