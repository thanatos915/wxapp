var t = require("../../../wxParse/wxParse.js"), a = require("../../../components/goods/specifications_model.js"), e = require("../../../components/goods/goods_banner.js");

Page({
    data: {
        pageType: "INTEGRAL",
        tab_detail: "active",
        tab_comment: ""
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var a = this;
        t.integral && a.setData({
            user_integral: t.integral
        }), t.goods_id && (a.setData({
            id: t.goods_id
        }), a.getGoods());
    },
    getGoods: function() {
        var a = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.integral.goods_info,
            data: {
                id: a.data.id
            },
            success: function(e) {
                if (0 == e.code) {
                    var o = e.data.goods.detail;
                    t.wxParse("detail", "html", o, a), getApp().core.setNavigationBarTitle({
                        title: e.data.goods.name
                    });
                    var i = e.data.goods;
                    i.num = e.data.goods.goods_num, i.pic_list = e.data.goods.goods_pic_list, a.setData({
                        goods: e.data.goods,
                        attr_group_list: e.data.attr_group_list
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateTo({
                            url: "/pages/integral-mall/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    getApp().core.hideLoading();
                }, 500);
            }
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    exchangeGoods: function() {
        var t = this;
        if (!t.data.show_attr_picker) return t.setData({
            show_attr_picker: !0
        }), !0;
        var a = t.data.attr_group_list, e = [];
        for (var o in a) {
            var i = !1;
            for (var r in a[o].attr_list) if (a[o].attr_list[r].checked) {
                i = {
                    attr_id: a[o].attr_list[r].attr_id,
                    attr_name: a[o].attr_list[r].attr_name
                };
                break;
            }
            if (!i) return getApp().core.showToast({
                title: "请选择" + a[o].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: a[o].attr_group_id,
                attr_group_name: a[o].attr_group_name,
                attr_id: i.attr_id,
                attr_name: i.attr_name
            });
        }
        var n = t.data.user_integral, s = t.data.attr_integral, g = t.data.attr_num;
        if (parseInt(n) < parseInt(s)) return getApp().core.showToast({
            title: "积分不足!",
            image: "/images/icon-warning.png"
        }), !0;
        if (g <= 0) return getApp().core.showToast({
            title: "商品库存不足!",
            image: "/images/icon-warning.png"
        }), !0;
        var d = t.data.goods, p = t.data.attr_price, s = t.data.attr_integral;
        t.setData({
            show_attr_picker: !1
        }), getApp().core.navigateTo({
            url: "/pages/integral-mall/order-submit/index?goods_info=" + JSON.stringify({
                goods_id: d.id,
                attr: e,
                attr_price: p,
                attr_integral: s
            })
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), a.init(this), e.init(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    }
});