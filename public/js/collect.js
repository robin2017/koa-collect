(function (root) {
   'use strict';

   //扩展帮助方法
   var helper = {};

   // 唯一标示 uuid
   helper.uuid = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
      });
   };

   // 得到cookie
   helper.getCookie = function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
         return unescape(arr[2]);
      } else {
         return null;
      }
   };

   helper.setCookie = function (name, value, time) {
      if (time) {
         document.cookie = name + "=" + escape(value) + ";expires=" + time;
      } else {
         document.cookie = name + "=" + escape(value) + ";";
      }
   };

   //遍历
   /**
    * @method each
    * @parame loopable 要遍历的对象
    * @parame callback 回调函数
    * @parame self 上下文
    **/
   helper.each = function (loopable, callback, self) {
      var additionalArgs = Array.prototype.slice.call(arguments, 3);
      if (loopable) {
         if (loopable.length === +loopable.length) {
            var i;
            for (var i = 0; i < loopable.length; i++) {
               callback.apply(self, [loopable[i], i].concat(additionalArgs));
            }
         } else {
            for (var item in loopable) {
               callback.apply(self, [loopable[item], item].concat(additionalArgs));
            }
         }
      }
   };

   //扩展
   /**
    *@method extend
    *@parame base 要扩展的对象
    *@return base  返回扩展后的对象
    **/
   helper.extend = function (base) {
      helper.each(Array.prototype.slice.call(arguments, 1), function (extensionObject) {
         helper.each(extensionObject, function (value, key) {
            if (extensionObject.hasOwnPrototype(key)) {
               base[key] = value;
            }
         });
      });
      return base;
   };

   //返回数组元素所在的位置，确定是否包含在里面
   /**
    *@method indexOf
    *@parame arrayToSearch 查找的对象
    *@parame item 查找的元素
    *@return args  返回位置
    **/
   helper.indexOf = function (arrayToSearch, item) {
      if (Array.prototype.indexOf) {
         return arrayToSearch.indexOf(item);
      } else {
         for (var i = 0; i < arrayToSearch.length; i++) {
            if (arrayToSearch[i] === item) return i;
         }
         return -1;
      }
   };

   // 绑定事件
   helper.on = function (target, type, handler) {
      if (target.addEventListener) {
         target.addEventListener(type, handler, false);
      } else {
         target.attachEvent("on" + type,
            function (event) {
               return handler.call(target, event);
            }, false);
      }
   };

   //所有的采集请求都是从这发出(三个时刻：加载时，关闭时，点击时)
   helper.send = function (obj, url) {
      const param = helper.changeJSON2Query({...obj,currentTime:new Date()})
      url = url + param + '&random=' + Math.random();
      //数据采集方案一：ajax(麻烦，不支持跨域)
      //   let xhr = new XMLHttpRequest();
      //   xhr.open('GET', url )
      //   xhr.send()

      //数据采集方案二：图片请求(简单，支持跨域)
      var img = new Image(0, 0);
      img.src = url
   };

   helper.changeJSON2Query = function (jsonObj) {
      var args = '';
      for (var i in jsonObj) {
         if (args != '') {
            args += '&';
         }
         args += i + '=' + encodeURIComponent(jsonObj[i]);
      }
      return args;
   };

   // 监听页面所有ajax请求
   /**
    * @parames {function} callback 回调 
    */
   helper.listenAjax = function (callback) {
      var open = window.XMLHttpRequest.prototype.open;
      var send = window.XMLHttpRequest.prototype.send;

      var openReplacement = function (method, url) {
         open.apply(this, arguments);
      };

      var readystatechangeReplacement = function () {
         if (this.readyState === 4 && this.status === 200) {
            callback && callback(this);
         }
      };

      var sendReplacement = function () {
         var that = this;
         send.apply(this, arguments);
         setTimeout(function () {
            that.onreadystatechange = readystatechangeReplacement;
         }, 0);
      };

      window.XMLHttpRequest.prototype.open = openReplacement;
      window.XMLHttpRequest.prototype.send = sendReplacement;
   };
   //============help方法定义完成=======
   var collect = {};
   var host = window.location.host;

   collect.parmas = {};

   collect.url = 'localhost/users?';

   collect.uuid = helper.uuid();

   collect.setParames = function () {
      if (document) {
         this.parmas.domain = document.domain || '';
         this.parmas.url = document.URL || '';
         this.parmas.title = document.title || '';
         this.parmas.referrer = document.referrer;
      }
      if (window && window.screen) {
         this.parmas.sh = window.screen.height || 0;
         this.parmas.sw = window.screen.width || 0;
         this.parmas.cd = window.screen.colorDepth || 0;
      }
      if (navigator) {
         this.parmas.lang = navigator.language || '';
         // this.parmas.userAgent = navigator.userAgent || '';
      }
      if (document && document.cookie) {
         this.parmas.cookie = document.cookie;
      }
      if (!this.parmas.systemName) {
         this.parmas.systemName = host.split('.')[0] || '';
      }
      this.parmas.target = [];
      //解析 配置项
      if (typeof _collectConfig != "undefined") {
         for (var i in _collectConfig) {
            switch (_collectConfig[i][0]) {
               case '_setAccount':
                  this.parmas.accout = _collectConfig[i][1];
                  break;
               case 'Action':
                  this.parmas.action = _collectConfig[i].slice(1);
                  break;
               case 'Target':
                  this.parmas.target = _collectConfig[i].slice(1);
                  break;
               case 'Url':
                  collect.url = _collectConfig[i][1];
                  break;
               case 'CookieBool':
                  if (_collectConfig[i][1] == 'false') {
                     delete this.parmas.cookie;
                  }
                  break;
               case 'systemName': // 指定哪个平台下的数据标记
                  this.parmas.systemName = _collectConfig[i][1];
                  break;
               default:
                  break;
            }
         }
         if (_collectConfig.syserror && _collectConfig.syserror.length) {
            this.parmas.syserror = _collectConfig.syserror;
            _collectConfig.syserror = [];
         } else {
            delete this.parmas.syserror;
         }

         // 用户自定义字段
         if (_collectConfig.userConfig) {
            for (var k in _collectConfig.userConfig) {
               if (_collectConfig.userConfig.hasOwnProperty(k)) {
                  this.parmas[k] = _collectConfig.userConfig[k]
               }
            }
         }
      } else {
         throw "必须定义全局配置变量 _collectConfig，配置指定的请求Url。示例： var _collectConfig = _collectConfig || []; _collectConfig.push(['Url','localhost/users?']);";
      }
   };

   collect.getParames = function () {
      return this.parmas;
   };

   // 用户的停留时间
   collect.timer = function () {
      this.disp = new Date().getTime();
   };

   collect.event = function () {
      var that = this;
      helper.on(document.body, 'click', function (e) {

         var $target = e.target || e.srcElement;
         var currtagName = $target.nodeName.toLowerCase();
         if (currtagName == "body" || currtagName == "html" || currtagName == "") {
            return 0;
         }
         if (helper.indexOf(that.parmas.target, currtagName) > -1 || $target.getAttribute('collect')) {
            if (!helper.getCookie('_collectConfig_userAccect')) {
               helper.setCookie('_collectConfig_userAccect', that.uuid);
               // 初次进入网站，返回用户凭证。
               that.parmas.cookie = '_collectConfig_userAccect=' + that.uuid + ';' + that.parmas.cookie;
            }
            that.parmas.collectMark = $target.getAttribute('collect');
            that.parmas.clickElement = '{nodeName:' + $target.nodeName +
               ',title:' + $target.title + ',text:' + $target.innerHTML + '}';
            that.setParames();
            helper.send(that.getParames(), that.url);
         }
      });

      // 用户离开页面时返回逗留时间
      window.onbeforeunload = function (evt) {
         that.parmas.disp = new Date().getTime() - that.disp;
         if (!helper.getCookie('_collectConfig_userAccect')) {
            helper.setCookie('_collectConfig_userAccect', that.uuid);
         }
         delete that.parmas.collectMark;
         delete that.parmas.clickElement;
         that.setParames();
         helper.send(that.getParames(), that.url);
      };
   };

   collect.init = function () {
      var that = this;
      that.timer();
      that.event();
      that.setParames();
      if (!helper.getCookie('_collectConfig_userAccect')) {
         helper.setCookie('_collectConfig_userAccect', that.uuid);
      }
      const params = that.getParames()
      helper.send(params, that.url);
      delete that.parmas.syserror;
   };

   collect.init();

})(window);