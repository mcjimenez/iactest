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
  var _btoPingSvr1 = document.getElementById('pingSvr1');
  var _btoPingSvr2 = document.getElementById('pingSvr2');

  var whatEntry = _eventsEntries;

  var _countSvr1 = 1;
  var _countSvr2 = 1;
  var _portSrv1 = null;
  var _portSrv2 = null;

  var msg = {
    txt: 'CLIENT MSG'
  };

  function addTxt(txt, where) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    where.appendChild(li);
  }

  function connect(app, where, rules) {
    return new Promise((resolve, reject) => {
      if (app.connect) {
        app.connect(where, rules).then(function onConnAccepted(ports) {
          var i = 1;
          var tmpPort;
          ports.forEach(port => {
            addTxt('IAC connection success. Adding listener!', whatEntry);
            port.onmessage = function(evt) {
              addTxt('Received [' + where + ']:' +
                       (evt.data ? JSON.stringify(evt.data) : 'No data'),
                     whatEntry);
            };
            msg.num = 0;
            addTxt('Sending [' + where + ']:' + JSON.stringify(msg), whatEntry);
            port.postMessage(msg);

            (i--) && (tmpPort = port);
          });
          resolve(tmpPort);
        }, function onConnRejected(reason) {
          //addTxt('Cannot connect:' + reason, whatEntry);
          reject('Cannot connect:' + reason);
        });
      } else {
        //addTxt('Error: We don\'t have app.connect', whatEntry);
        reject('Error: We don\'t have app.connect');
      };
    });
  }

  window.addEventListener('load', function() {
    navigator.mozApps.getSelf().onsuccess = function(evt) {
      var app = evt.target.result;

      function send(aCount, aPort, aSvr) {
        msg.num = aCount;
        addTxt('Sending [' + aSvr + ']:' + JSON.stringify(msg), whatEntry);
        aPort.postMessage(msg);
      }

      console.log('Connecting ' + WHERE_SVR1);
      connect(app, WHERE_SVR1, RULES_SVR1).then(port => {
        _btoPingSvr1.addEventListener('click', function(evt) {
console.log(WHERE_SVR1 + (port?' tiene port':'no port'));
          send(_countSvr1++, port, WHERE_SVR1);
        });
      }).catch(error => {
        addTxt(error, whatEntry);
      });

      console.log('Connecting ' + WHERE_SVR2);
      connect(app, WHERE_SVR2, RULES_SVR2).then(port => {
        _btoPingSvr2.addEventListener('click', function(evt) {
console.log(WHERE_SVR2 + (port?' tiene port':'no port'));
          send(_countSvr2++, port, WHERE_SVR2);
        });
      }).catch(error => {
        addTxt(error, whatEntry);
      });
    };
  });

})(this);
