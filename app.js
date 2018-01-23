// app.js
App({
  globalData: {
    session: null,
    userInfo: null,
    picUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516107456424&di=fa76e77ada13337b47b711d45f05edf3&imgtype=0&src=http%3A%2F%2Fimage.tupian114.com%2F20121029%2F11381052.jpg.238.jpg"
  },
  header: {
    session_id: null,
  },
  config: {
    host: 'https://www.xiaobaidiandev.com/api',
    appId: "wxd4eae843e18ff7da",//小程序APPid
    mchId: "1495032292"//微信商户id
  },
  onLaunch: function () {
    this.confirmUserLogin();
  },
  confirmUserLogin() {
    var reload = false;
    wx.checkSession({
      fail: function () {
        reload = true;
        console.info("检测session状态 ，返回fail")
      },
      success: function () {
        console.info("检测session状态 ，返回success")
      }
    })
    if (!reload) {
      try {
        var value = wx.getStorageSync('session');
        if (value) {
          this.globalData.session = value;
        }
        else {
          reload = true;
        }
      } catch (e) {
        reload = true;
      }
      try {
        var value = wx.getStorageSync('user_info');
        if (value) {
          this.globalData.userInfo = value;
        }
        else {
          reload = true;
        }
      } catch (e) {
        reload = true;
      }
    }
    if (reload) {
      this.loginUser();
    }
  },
  loginUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: that.config.host + '/login',
          method: 'get',
          data: {
            'code': code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            
            console.log("=========login ======");
            
            that.globalData.session = res.data.data.session;
            that.header.session_id = res.data.data.session;
            
            console.log("服务器接口返回的session=" + res.data.data.session);
            wx.setStorage({
              key: 'session',
              data: res.data.data.session,
            })
          }
        })
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.info("用户信息-》", res)
            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
            })
          },
          fail: function () {
            wx.showModal({
              title: '警告',
              content: '您未搜权登录小程序，将无法使用部分功能，请点击确定按钮重新授权登录',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userInfo"])
                        wx.getUserInfo({
                          success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            console.info("用户信息-》", res)
                            wx.setStorage({
                              key: 'userInfo',
                              data: res.userInfo,
                            })
                          }
                        })
                    }
                  })
                }
              }
            })


          }
        });
      }
    });
  },



  // getUserSessionKey: function (code) {
  //   //用户的订单状态
  //   var that = this;
  //   wx.request({
  //     url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
  //     method: 'post',
  //     data: {
  //       code: code
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       //--init data        
  //       var data = res.data;
  //       if (data.status == 0) {
  //         wx.showToast({
  //           title: data.err,
  //           duration: 2000
  //         });
  //         return false;
  //       }

  //       that.globalData.userInfo['sessionId'] = data.session_key;
  //       that.globalData.userInfo['openid'] = data.openid;
  //       that.onLoginUser();
  //     },
  //     fail: function (e) {
  //       wx.showToast({
  //         title: '网络异常！err:getsessionkeys',
  //         duration: 2000
  //       });
  //     },
  //   });
  // },
  // onLoginUser: function () {
  //   var that = this;
  //   var user = that.globalData.userInfo;
  //   wx.request({
  //     url: that.d.ceshiUrl + '/Api/Login/authlogin',
  //     method: 'post',
  //     data: {
  //       SessionId: user.sessionId,
  //       gender: user.gender,
  //       NickName: user.nickName,
  //       HeadUrl: user.avatarUrl,
  //       openid: user.openid
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       //--init data        
  //       var data = res.data.arr;
  //       var status = res.data.status;
  //       if (status != 1) {
  //         wx.showToast({
  //           title: res.data.err,
  //           duration: 3000
  //         });
  //         return false;
  //       }
  //       that.globalData.userInfo['id'] = data.ID;
  //       that.globalData.userInfo['NickName'] = data.NickName;
  //       that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
  //       var userId = data.ID;
  //       if (!userId) {
  //         wx.showToast({
  //           title: '登录失败！',
  //           duration: 3000
  //         });
  //         return false;
  //       }
  //       that.d.userId = userId;
  //     },
  //     fail: function (e) {
  //       wx.showToast({
  //         title: '网络异常！err:authlogin',
  //         duration: 2000
  //       });
  //     },
  //   });
  // },
});





