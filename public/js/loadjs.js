(function () {
    var collect = document.createElement('script');
    collect.type = 'text/javascript';
    collect.async = true;
    collect.src = ('https:' == document.location.protocol ? 'https://' : 'http://localhost:12800') + '/static/js/collect.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(collect, s);
  })();