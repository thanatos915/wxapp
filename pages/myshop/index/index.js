getApp(), getApp().api;

Page({
    data: {
        is_show: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.shop.index,
            success: function(t) {
                getApp().core.hideLoading(), 0 !== t.code && getApp().core.showModal({
                    title: "提示",
                    content: "\b店铺已被关闭！请联系管理员",
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
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    navigatorSubmit: function(t) {
        getApp().request({
            url: getApp().api.user.save_form_id + "&form_id=" + t.detail.formId
        }), getApp().core.navigateTo({
            url: t.detail.value.url
        });
    },
    scanCode: function() {
         // console.log('点击了');
        wx.scanCode({
            onlyFromCamera: true,
            success (res) {
                var url = res.path;
                getApp().core.redirectTo({
                    url: '/' + url
                });
                // 查询订单
                /*
                getApp().request({
                    url: getApp().api.order.detail,
                    data: {
                        order_no: order_no
                    },
                    success: function(t) {
                        getApp().core.hideLoading();
                        if (0 !== t.code) {
                            getApp().core.showModal({
                                title: "提示",
                                contents: "订单信息有误！"
                            })
                        }

                    }
                });*/
            }
        })
    }
});