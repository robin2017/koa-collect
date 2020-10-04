var _collectConfig = _collectConfig || [];
_collectConfig.push(['Url', 'http://localhost:12800/users?']);
_collectConfig.push(['_setAccount', 'YS-Test-1']);
//_collectConfig.push(['Action','Title']);
//_collectConfig.push(['Target','a','div','button']);
// 收集的平台 host，默认不需要配置
_collectConfig.push(['systemName', 'myWap']);
// 关闭收集cookie
_collectConfig.push(['CookieBool', 'false']);

// 用户自定义收集字段
_collectConfig.userConfig = {
  author: 'robin'
};
_collectConfig.syserror = [];
//记录客户端脚本错误  
window.onerror = function (error) {
  try {
    var msg;
    for (var i = 0; i < arguments.length; i++) {
      if (i == 0 || i == 2) {
        msg += " | " + arguments[i];
      }
    }
    if (msg.length > 0) {
      _collectConfig.syserror.push('syserror:' + msg);
    }
    return true;
  } catch (e) { };
};