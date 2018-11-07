var t = getApp().helper, a = (getApp(), getApp().api, require("./../../components/quick-navigation/quick-navigation.js"));

Page({
    data: {
        tab: 1,
        sort: 1,
        coupon_list: [],
        copy: !1
    },
    onLoad: function(o) {
        getApp().page.onLoad(this, o), a.init(this);
        var e = this;
        if ("undefined" == typeof my) {
            if (o.scene) {
                var i = decodeURIComponent(o.scene);
                i && (i = t.scene_decode(i)).mch_id && (o.mch_id = i.mch_id);
            }
        } else if (null !== getApp().query) {
            var s = getApp().query;
            getApp().query = null, o.mch_id = s.mch_id;
        }
        e.setData({
            tab: o.tab || 1,
            sort: o.sort || 1,
            mch_id: o.mch_id || !1,
            cat_id: o.cat_id || ""
        }), e.data.mch_id || getApp().core.showModal({
            title: "提示",
            content: "店铺不存在！店铺id为空"
        }), setInterval(function() {
            e.onScroll();
        }, 40), this.getShopData();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getGoodsList();
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.shop ? t.data.shop.name : "商城首页"
        };
    },
    kfuStart: function() {
        this.setData({
            copy: !0
        });
    },
    kfuEnd: function() {
        this.setData({
            copy: !1
        });
    },
    copyinfo: function(t) {
        getApp().core.setClipboardData({
            data: t.target.dataset.info,
            success: function(t) {
                getApp().core.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    onScroll: function(t) {
        var a = this;
        getApp().core.createSelectorQuery().selectViewport(".after-navber").scrollOffset(function(t) {
            var o = 2 == a.data.tab ? 136.5333 : 85.3333;
            t.scrollTop >= o ? a.setData({
                fixed: !0
            }) : a.setData({
                fixed: !1
            });
        }).exec();
    },
    getShopData: function() {
        var t = this, a = (t.data.current_page || 0) + 1, o = "shop_data_mch_id_" + t.data.mch_id, e = getApp().core.getStorageSync(o);
        e && t.setData({
            shop: e.shop
        }), getApp().core.showNavigationBarLoading(), t.setData({
            loading: !0
        }), getApp().request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: t.data.mch_id,
                tab: t.data.tab,
                sort: t.data.sort,
                page: a,
                cat_id: t.data.cat_id
            },
            success: function(e) {
                1 != e.code ? 0 == e.code && (t.setData({
                    shop: e.data.shop,
                    coupon_list: e.data.coupon_list,
                    hot_list: e.data.goods_list,
                    goods_list: e.data.goods_list,
                    new_list: e.data.new_list,
                    current_page: a,
                    cs_icon: e.data.shop.cs_icon
                }), getApp().core.setStorageSync(o, e.data)) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideNavigationBarLoading(), t.setData({
                    loading: !1
                });
            }
        });
    },
    getGoodsList: function() {
        var t = this;
        if (3 != t.data.tab && !t.data.loading && !t.data.no_more) {
            t.setData({
                loading: !0
            });
            var a = (t.data.current_page || 0) + 1;
            getApp().request({
                url: getApp().api.mch.shop,
                data: {
                    mch_id: t.data.mch_id,
                    tab: t.data.tab,
                    sort: t.data.sort,
                    page: a,
                    cat_id: t.data.cat_id
                },
                success: function(o) {
                    0 == o.code && (1 == t.data.tab && (o.data.goods_list && o.data.goods_list.length ? (t.data.hot_list = t.data.hot_list.concat(o.data.goods_list), 
                    t.setData({
                        hot_list: t.data.hot_list,
                        current_page: a
                    })) : t.setData({
                        no_more: !0
                    })), 2 == t.data.tab && (o.data.goods_list && o.data.goods_list.length ? (t.data.goods_list = t.data.goods_list.concat(o.data.goods_list), 
                    t.setData({
                        goods_list: t.data.goods_list,
                        current_page: a
                    })) : t.setData({
                        no_more: !0
                    })));
                },
                complete: function() {
                    t.setData({
                        loading: !1
                    });
                }
            });
        }
    }
});