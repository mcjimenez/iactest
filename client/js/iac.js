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

  function connect(app, where, rules) {
    if (app.connect) {
      app.connect(where, rules).then(function onConnAccepted(ports) {
        var i = 1;
        ports.forEach(port => {
          addTxt('IAC connection success. Adding listener!', whatEntry);
          port.onmessage = function(evt) {
            addTxt('Received [' + where + ']:' +
                  (evt.data ? JSON.stringify(evt.data) : 'No data'), whatEntry);
          };
          msg.num = _count++;
          addTxt('Sending [' + where + ']:' + JSON.stringify(msg), whatEntry);
          port.postMessage(msg);

          (i--) && (_port = port);
        });
      }, function onConnRejected(reason) {
        addTxt('Cannot connect:' + reason, whatEntry);
      });
    } else {
      addTxt('Error: We don\'t have app.connect');
    };
  }

  window.addEventListener('load', function() {
    navigator.mozApps.getSelf().onsuccess = function(evt) {
      var app = evt.target.result;

      console.log('Connecting ' + WHERE_SVR1);
      connect(app, WHERE_SVR1, RULES_SVR1);
      console.log('Connecting ' + WHERE_SVR2);
      connect(app, WHERE_SVR2, RULES_SVR2);

      _btoPing.addEventListener('click', function send() {
        msg.num = _count++;
        addTxt('Sending:' + JSON.stringify(msg), whatEntry);
        _port.postMessage(msg);
      });
    };
  });

})(this);
