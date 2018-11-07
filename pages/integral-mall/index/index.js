var t = 0, e = -1;

Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t), getApp().page.onLoad(this, t), getApp().core.showLoading({
            title: "加载中"
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this), getApp().page.onReady(this);
    },
    onShow: function(a) {
        getApp().page.onShow(this), getApp().page.onShow(this);
        var n = this;
        getApp().request({
            url: getApp().api.integral.index,
            data: {
                page: 1
            },
            success: function(a) {
                if (0 == a.code) {
                    var o = [], i = a.data.goods_list, s = [];
                    if (i) for (var p in i) i[p].goods.length > 0 && s.push(i[p]);
                    if (s.length > 0) for (var r in s) {
                        var g = s[r].goods;
                        for (var c in g) 1 == g[c].is_index && o.push(g[c]);
                    }
                    if (a.data.today && n.setData({
                        register_day: 1
                    }), n.setData({
                        banner_list: a.data.banner_list,
                        coupon_list: a.data.coupon_list,
                        goods_list: s,
                        index_goods: o,
                        integral: a.data.user.integral
                    }), -1 != e) {
                        var d = [];
                        d.index = e, d.catId = t, n.catGoods({
                            currentTarget: {
                                dataset: d
                            }
                        });
                    }
                }
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    exchangeCoupon: function(t) {
        var e = this, a = e.data.coupon_list, n = t.currentTarget.dataset.index, o = a[n], i = e.data.integral;
        if (parseInt(o.integral) > parseInt(i)) e.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (parseFloat(o.price) > 0) s = "需要" + o.integral + "积分+￥" + parseFloat(o.price); else var s = "需要" + o.integral + "积分";
            if (parseInt(o.total_num) <= 0) return void e.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(o.num) >= parseInt(o.user_num)) return o.type = 1, void e.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1,
                coupon_list: a
            });
            getApp().core.showModal({
                title: "确认兑换",
                content: s,
                success: function(t) {
                    t.confirm && (parseFloat(o.price) > 0 ? (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 2
                        },
                        success: function(t) {
                            0 == t.code && getApp().core.requestPayment({
                                _res: t,
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                complete: function(n) {
                                    "requestPayment:fail" != n.errMsg && "requestPayment:fail cancel" != n.errMsg ? "requestPayment:ok" == n.errMsg && (o.num = parseInt(o.num), 
                                    o.num += 1, o.total_num = parseInt(o.total_num), o.total_num -= 1, i = parseInt(i), 
                                    i -= parseInt(o.integral), e.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: t.msg,
                                        coupon_list: a,
                                        integral: i
                                    })) : getApp().core.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })) : (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code && (o.num = parseInt(o.num), o.num += 1, o.total_num = parseInt(o.total_num), 
                            o.total_num -= 1, i = parseInt(i), i -= parseInt(o.integral), e.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon_list: a,
                                integral: i
                            }));
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })));
                }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    },
    couponInfo: function(t) {
        var e = t.currentTarget.dataset;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/coupon-info/index?coupon_id=" + e.id
        });
    },
    goodsAll: function() {
        var t = this, e = t.data.goods_list, a = [];
        for (var n in e) {
            var o = e[n].goods;
            e[n].cat_checked = !1;
            for (var i in o) a.push(o[i]);
        }
        t.setData({
            index_goods: a,
            cat_checked: !0,
            goods_list: e
        });
    },
    catGoods: function(a) {
        var n = a.currentTarget.dataset, o = this, i = o.data.goods_list, s = i.find(function(t) {
            return t.id == n.catId;
        });
        t = n.catId, e = n.index;
        var p = n.index;
        for (var r in i) i[r].id == i[p].id ? i[r].cat_checked = !0 : i[r].cat_checked = !1;
        o.setData({
            index_goods: s.goods,
            goods_list: i,
            cat_checked: !1
        });
    },
    goodsInfo: function(t) {
        var e = t.currentTarget.dataset.goodsId, a = this;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/goods-info/index?goods_id=" + e + "&integral=" + a.data.integral
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this), getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this), getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this), getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this), getApp().page.onReachBottom(this);
    },
    shuoming: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/shuoming/index"
        });
    },
    detail: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/detail/index"
        });
    },
    exchange: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/exchange/index"
        });
    },
    register: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/register/index"
        });
    }
});