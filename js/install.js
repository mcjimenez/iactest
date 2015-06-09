(function(window) {
  'use strict';

  var origin = document.location.origin;
  var _btoInstallClt = document.getElementById('installClt');
  var _btoInstallSvr = document.getElementById('installSvr');

  console.log("CJC - origin:"+ origin);

  function install(what) {
    var origin = document.location.origin;
    // Could get this from the href but not really worth the hassle
    var realPath = origin + '/' + what + '/manifest.webapp';
    console.log('CJC - Installing:' + realPath);
    navigator.mozApps.install(realPath);
  }

  window.addEventListener('load', function() {
    _btoInstallClt.addEventListener('click', install.bind(null, 'client'));
    _btoInstallSvr.addEventListener('click', install.bind(null, 'server'));
  });

})(window);
