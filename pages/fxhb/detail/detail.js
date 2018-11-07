var e = null;

Page({
    data: {
        page_img: {
            bg: getApp().webRoot + "/statics/images/fxhb/bg.png",
            close: getApp().webRoot + "/statics/images/fxhb/close.png",
            hongbao_bg: getApp().webRoot + "/statics/images/fxhb/hongbao_bg.png",
            open_hongbao_btn: getApp().webRoot + "/statics/images/fxhb/open_hongbao_btn.png",
            wechat: getApp().webRoot + "/statics/images/fxhb/wechat.png",
            coupon: getApp().webRoot + "/statics/images/fxhb/coupon.png",
            pointer_r: getApp().webRoot + "/statics/images/fxhb/pointer_r.png",
            best_icon: getApp().webRoot + "/statics/images/fxhb/best_icon.png",
            more_l: getApp().webRoot + "/statics/images/fxhb/more_l.png",
            more_r: getApp().webRoot + "/statics/images/fxhb/more_r.png",
            cry: getApp().webRoot + "/statics/images/fxhb/cry.png",
            share_modal_bg: getApp().webRoot + "/statics/images/fxhb/share_modal_bg.png"
        },
        goods_list: null,
        rest_time_str: "--:--:--"
    },
    onLoad: function(e) {
        var t = this;
        getApp().page.onLoad(this, e);
        var a = e.id;
        getApp().core.showLoading({
            title: "加载中",
            mask: !0
        }), getApp().request({
            url: getApp().api.fxhb.detail,
            data: {
                id: a
            },
            success: function(e) {
                getApp().core.hideLoading(), 1 != e.code ? (0 == e.code && (t.setData({
                    rule: e.data.rule,
                    share_pic: e.data.share_pic,
                    share_title: e.data.share_title,
                    coupon_total_money: e.data.coupon_total_money,
                    rest_user_num: e.data.rest_user_num,
                    rest_time: e.data.rest_time,
                    hongbao: e.data.hongbao,
                    hongbao_list: e.data.hongbao_list,
                    is_my_hongbao: e.data.is_my_hongbao,
                    my_coupon: e.data.my_coupon,
                    goods_list: e.data.goods_list
                }), t.setRestTimeStr()), t.showShareModal()) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && (1 == e.game_open ? getApp().core.redirectTo({
                            url: "/pages/fxhb/open/open"
                        }) : getApp().core.redirectTo({
                            url: "/pages/index/index"
                        }));
                    }
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
    showRule: function() {
        this.setData({
            showRule: !0
        });
    },
    closeRule: function() {
        this.setData({
            showRule: !1
        });
    },
    showShareModal: function() {
        this.setData({
            showShareModal: !0
        });
    },
    closeShareModal: function() {
        this.setData({
            showShareModal: !1
        });
    },
    setRestTimeStr: function() {
        var t = this, a = t.data.rest_time || !1;
        !1 !== a && null !== a && ((a = parseInt(a)) <= 0 ? t.setData({
            rest_time_str: "00:00:00"
        }) : (e && clearInterval(e), e = setInterval(function() {
            if ((a = t.data.rest_time) <= 0) return clearInterval(e), void t.setData({
                rest_time_str: "00:00:00"
            });
            var o = parseInt(a / 3600), s = parseInt(a % 3600 / 60), i = parseInt(a % 3600 % 60);
            t.setData({
                rest_time: a - 1,
                rest_time_str: (o < 10 ? "0" + o : o) + ":" + (s < 10 ? "0" + s : s) + ":" + (i < 10 ? "0" + i : i)
            });
        }, 1e3)));
    },
    detailSubmit: function(e) {
        var t = this;
        getApp().core.showLoading({
            mask: !0
        }), getApp().request({
            url: getApp().api.fxhb.detail_submit,
            method: "post",
            data: {
                id: t.data.hongbao.id,
                form_id: e.detail.formId
            },
            success: function(e) {
                if (1 == e.code) return getApp().core.hideLoading(), void getApp().core.showToast({
                    title: e.msg,
                    complete: function() {
                        0 == e.game_open && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
                0 == e.code && (getApp().core.hideLoading(), getApp().core.showToast({
                    title: e.msg,
                    complete: function() {
                        1 == e.reload && getApp().core.redirectTo({
                            url: "/pages/fxhb/detail/detail?id=" + t.options.id
                        });
                    }
                }));
            }
        });
    },
    onShareAppMessage: function() {
        var e = this;
        getApp().page.onShareAppMessage(this);
        var t = e.data.__user_info;
        return {
            path: "/pages/fxhb/detail/detail?id=" + e.data.hongbao.id + (t ? "&user_id=" + t.id : ""),
            title: e.data.share_title || null,
            imageUrl: e.data.share_pic || null,
            complete: function(t) {
                e.closeShareModal();
            }
        };
    }
});