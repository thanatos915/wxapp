getApp().api;

Page({
    data: {
        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        order_money: 0
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), this.setData({
            custom: getApp().core.getStorageSync(getApp().const.CUSTOM)
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var e = this, t = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), o = e.data.__user_info;
        e.setData({
            share_setting: t
        }), o && 1 == o.is_distributor ? e.checkUser() : e.loadData();
    },
    checkUser: function() {
        var e = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_info,
            success: function(t) {
                0 == t.code && (e.setData({
                    total_price: t.data.price.total_price,
                    price: t.data.price.price,
                    cash_price: t.data.price.cash_price,
                    total_cash: t.data.price.total_cash,
                    team_count: t.data.team_count,
                    order_money: t.data.order_money,
                    custom: t.data.custom,
                    order_money_un: t.data.order_money_un
                }), getApp().core.setStorageSync(getApp().const.CUSTOM, t.data.custom), e.loadData()), 
                1 == t.code && (__user_info.is_distributor = t.data.is_distributor, e.setData({
                    __user_info: __user_info
                }), getApp().setUser(__user_info));
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    loadData: function() {
        var e = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.index,
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.share_setting) o = t.data.share_setting; else var o = t.data;
                    getApp().core.setStorageSync(getApp().const.SHARE_SETTING, o), e.setData({
                        share_setting: o
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    apply: function(e) {
        var t = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), o = getApp().getUser();
        1 == t.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != t.share_condition && 2 != t.share_condition || (0 == o.is_distributor ? getApp().core.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(a) {
                a.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: e.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == t.share_condition ? (o.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (o.is_distributor = 1, getApp().core.redirectTo({
                            url: "/pages/share/index"
                        })), getApp().setUser(o));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    }
});