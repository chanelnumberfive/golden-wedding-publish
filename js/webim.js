var curUserId = "zxh";
var curChatUserId = curUserId;
var conn = null;
var curRoomId = "195613810155848112";
var curChatRoomId = curRoomId;
var msgCardDivId = "chat01";
var talkToDivId = "talkTo";
var talkInputId = "talkInputId";
var bothRoster = [];
var toRoster = [];
var maxWidth = 200;
var groupFlagMark = "groupchat";
var chatRoomMark = "chatroom";
var groupQuering = false;
var textSending = false;
var time = 0;


var encode = function (str) {
    if (!str || str.length === 0) return "";
    var s = '';
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/<(?=[^o][^)])/g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    //s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
};


window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

//easemobwebim-sdk注册回调函数列表
$(document).ready(function () {

    if (Easemob.im.Helper.getIEVersion && Easemob.im.Helper.getIEVersion < 10) {
        $('#em-cr').remove();
    }

    conn = new Easemob.im.Connection({
        multiResources: Easemob.im.config.multiResources,
        https: Easemob.im.config.https,
        url: Easemob.im.config.xmppURL
    });
    //初始化连接
    conn.listen({
        //当连接成功时的回调方法
        onOpened: function () {
            handleOpen(conn);
        },
        //当连接关闭时的回调方法
        onClosed: function () {
            handleClosed();
        },
        //收到文本消息时的回调方法
        onTextMessage: function (message) {
            console.log("t-" + message.data);
            handleTextMessage(message);
        },

        onReceivedMessage: function (message) {
            console.log("b-" + message);
        },

        //异常时的回调方法
        onError: function (message) {
            handleError(message);
        }
    });
    regist();

    $(function () {
        $(window).bind('beforeunload', function () {
            curChatRoomId = null;
            if (conn) {
                conn.close();
                return navigator.userAgent.indexOf("Firefox") > 0 ? ' ' : '';
            }
        });
    });
});

//处理连接时函数,主要是登录成功后对页面元素做处理
var handleOpen = function (conn) {
    conn.getRoster({
        success: function (roster) {
            conn.listRooms({
                success: function (rooms) {
                    conn.setPresence(); //设置用户上线状态，必须调用
                },
                error: function (e) {
                    conn.setPresence(); //设置用户上线状态，必须调用
                }
            });
        }
    });
    conn.getChatRooms({
        apiUrl: Easemob.im.config.apiURL,
        success: function (list) {

            var rooms = list.data;
            if (rooms && rooms.length > 0) {
                for (i = 0; i < rooms.length; i++) {
                    console.log(rooms[i].name); //群组列表页面处理
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    //启动心跳
    if (conn.isOpened()) {
        conn.heartBeat(conn);
    }
};
//连接中断时的处理，主要是对页面进行处理
var handleClosed = function () {
    curUserId = null;
    curChatUserId = null;
    curRoomId = null;
    curChatRoomId = null;
    bothRoster = [];
    toRoster = [];
    groupQuering = false;
    textSending = false;
};

//异常情况下的处理方法
var handleError = function (e) {
    curChatRoomId = null;
    console.log(e);
    conn.stopHeartBeat(conn);
};
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == val.name)
            return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


var regist = function () {
    var user = curUserId;
    var pass = 'a123456789';

    var options = {
        username: user,
        password: pass,
        appKey: Easemob.im.config.appkey,
        success: function (result) {
            //根据用户名密码登录系统
            // alert("after login")
        },
        error: function (e) {
            // alert(e.error);
        },
        apiUrl: Easemob.im.config.apiURL
    };
    Easemob.im.Helper.registerUser(options);
    setTimeout(function () {
        conn.open({
            apiUrl: Easemob.im.config.apiURL,
            user: user,
            pwd: pass,
            //连接时提供appkey
            appKey: Easemob.im.config.appkey
        });
        console.log("after login");
        return false;
    }, 200);
    setTimeout(function () {
        conn.joinChatRoom({
            roomId: curRoomId
        });
        console.log("after join chatroom");
        return false;
    }, 600);
};


var sendText = function () {
    if (textSending) {
        return;
    }
    textSending = true;
    var msgInput = document.getElementById(talkInputId);
    var msg = msgInput.value;
    if (msg == null || msg.length == 0) {
        textSending = false;
        return;
    }
    var to = curChatRoomId;
    if (to == null) {
        textSending = false;
        return;
    }
    var options = {
        to: curRoomId,
        msg: msg,
        type: groupFlagMark,
        roomType: chatRoomMark
    };
    //    // 群组消息和个人消息的判断分支
    //    if (curChatUserId.indexOf(groupFlagMark) >= 0) {
    //        options.type = groupFlagMark;
    //        options.to = curRoomId;
    //        options.roomType = chatRoomMark;
    //    } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {
    //        options.type = groupFlagMark;
    //        options.roomType = chatRoomMark;
    //        options.to = curRoomId;
    //    }

    //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
    console.log("before send");
    conn.sendTextMessage(options);

    //当前登录人发送的信息在聊天窗口中原样显示
    //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
    appendMsg(curUserId, to, msg);
    msgInput.value = "";
    msgInput.focus();
    setTimeout(function () {
        textSending = false;
        console.log("after send");
    }, 1000);
};
var send = function (e) {
    var e = (e || window.event),
        tar = e.target || e.srcElement;

    var fI = $('#fileInput');
    fI.val('').attr('data-type', tar.getAttribute('type')).click();
};

//easemobwebim-sdk收到文本消息的回调方法的实现
var handleTextMessage = function (message) {
    var from = message.from; //消息的发送者
    var mestype = message.type; //消息发送的类型是群组消息还是个人消息
    var messageContent = message.data; //文本消息体
    //TODO  根据消息体的to值去定位那个群组的聊天记录
    var room = message.to;
    if (mestype == groupFlagMark || mestype == chatRoomMark) {
        appendMsg(message.from, mestype + message.to, messageContent);
        /*var $pushJson = {
            name: message.from,
            url: 'images/1.jpg',
            words: messageContent
        }
        $json.push($pushJson)
        console.log($json + "1")*/

    } else {
        appendMsg(from, from, messageContent);
    }
};


//显示聊天记录的统一处理方法
var appendMsg = function (who, contact, message) {
    // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
    var localMsg = null;
    if (typeof message == 'string') {
        localMsg = Easemob.im.Helper.parseTextMessage(message);
        localMsg = localMsg.body;
    } else {
        localMsg = message.data;
    }
    var messageContent = localMsg;
    for (var i = 0; i < messageContent.length; i++) {
        var msg = messageContent[i];
        var type = msg.type;
        var data = msg.data;

        var eletext = "<p3>" + data + "</p3>";
        var ele = $(eletext);
        ele[0].setAttribute("class", "chat-content-p3");
        ele[0].setAttribute("className", "chat-content-p3");
        if (curUserId == who) {
            ele[0].style.backgroundColor = "#EBEBEB";
        }
        for (var j = 0; j < ele.length; j++) {
            console.log("a-" + ele[j].innerHTML);
            var $pushJson = {
                name: '521',
                url: 'images/1.jpg',
                words: ele[j].innerHTML
            }
            //$json.push($pushJson);
			$('[data-blz-danmu]').sendWish($pushJson);
            //console.log($json + "2")
        }
    }
};

var clearInputValue = function (inputId) {
    $('#' + inputId).val('');
};
var getObjectURL = function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
};
var getLoacalTimeString = function getLoacalTimeString() {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return time;
}
