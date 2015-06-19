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

  var _countSvr1 = 0;
  var _countSvr2 = 0;
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
    if (app.connect) {
      app.connect(where, rules).then(function onConnAccepted(ports) {
        var i = 1;
        ports.forEach(port => {
          addTxt('IAC connection success. Adding listener!', whatEntry);
          port.onmessage = function(evt) {
            addTxt('Received [' + where + ']:' +
                  (evt.data ? JSON.stringify(evt.data) : 'No data'), whatEntry);
          };
          //msg.num = (where === WHERE_SVR1 ? _countSvr1++ : _countSvr2++) ;
          //addTxt('Sending [' + where + ']:' + JSON.stringify(msg), whatEntry);
          //port.postMessage(msg);

          console.log('CJC where:' + where);
          if (where === WHERE_SVR1) {
            console.log('CJC CONFIGURAR SVR1');
            (i--) && (_portSrv1 = port);
            msg.num = _countSvr1++;
          } else {
            console.log('CJC CONFIGURAR SVR2');
            (i--) && (_portSrv2 = port);
            msg.num = _countSvr2++;
          }

          addTxt('Sending [' + where + ']:' + JSON.stringify(msg), whatEntry);
          port.postMessage(msg);

          //(i--) && (where === WHERE_SVR1 ? _portSrv1 = port : _portSrv2 = port);
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

      function send(count, port, svr, evt) {
        msg.num = count++;
        addTxt('Sending [' + svr + ']:' + JSON.stringify(msg), whatEntry);
        port.postMessage(msg);
      }

      _btoPingSvr1.addEventListener('click',
                       send.bind(undefined, _countSvr1, _portSrv1, WHERE_SVR1));
      _btoPingSvr2.addEventListener('click',
                       send.bind(undefined, _countSvr2, _portSrv2, WHERE_SVR2));
    };
  });

})(this);
