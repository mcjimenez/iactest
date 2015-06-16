(function(imports) {
'use strict';
  var WHERE_SVR1 = 'iacsvr1';
  var WHERE_SVR2 = 'iacsvr2';
  var RULES_SVR1 = {
    "minimumAccessLevel": "web",
    "pageURLs": [
      "^https://.*\\.github\\.io/iactest.*"
    ]
  };
  var RULES_SVR2 = {
    "minimumAccessLevel": "web",
    "pageURLs": [
      "^https://.*\\.github\\.io/iactest.*"
    ]
  };

  var app = null;

  var _eventsEntries = document.getElementById('eventsEntries');
  var _btoPing = document.getElementById('ping');

  var whatEntry = _eventsEntries;

  var _count = 0;
  var _port = null;

  var msg = {
    txt: 'CLIENT MSG'
  };

  function addTxt(txt, where) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    where.appendChild(li);
  }

  function init() {
    navigator.mozApps.getSelf().onsuccess = function(evt) {
      app = evt.target.result;
    };
  }

  function connect(where, rules) {
    if (app.connect) {
      app.connect(where, rules).then(function onConnAccepted(ports) {
        var i = 1;
        ports.forEach(port => {
          addTxt('CJC - IAC connection success. Adding listener!', whatEntry);
          port.onmessage = function(evt) {
            addTxt('Received:' +
                  (evt.data ? JSON.stringify(evt.data) : 'No data'), whatEntry);
          };
          msg.num = _count++;
          addTxt('Sending:' + JSON.stringify(msg), whatEntry);
          port.postMessage(msg);

          (i--) && (_port = port);
        });
      }, function onConnRejected(reason) {
        addTxt('Cannot connect:' + reason, whatEntry);
      });
    };
  }

  window.addEventListener('load', function() {
    //connect();
    init();
    console.log('Connectiong ' + WHERE_SVR1);
    connect(WHERE_SVR1, RULES_SVR1);
    console.log('Connectiong ' + WHERE_SVR2);
    connect(WHERE_SVR2, RULES_SVR2);
    _btoPing.addEventListener('click', function send() {
      msg.num = _count++;
      addTxt('Sending:' + JSON.stringify(msg), whatEntry);
      _port.postMessage(msg);
    });
  });

})(this);
