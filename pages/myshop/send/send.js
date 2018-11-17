// pages/order-list/order-list.js
getApp(), getApp().api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (t) {
      getApp().page.onLoad(this, t);
      var e = this;
      getApp().core.showLoading({
          title: "加载中"
      }), getApp().request({
          url: getApp().api.shop.send,
          success: function(t) {
              getApp().core.hideLoading(), 0 !== t.code && getApp().core.showModal({
                  title: "提示",
                  content: "请求信息出错，请稍候重试",
                  showCancel: !1,
                  success: function(t) {
                      t.confirm && getApp().core.navigateBack();
                  }
              }), e.setData(t.data), e.setData({
                  is_show: !0
              }), 1 == t.code && getApp().core.redirectTo({
                  url: "/pages/user/user"
              });
          }
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})