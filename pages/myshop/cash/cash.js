function e(e, a) {
    return e = parseFloat(e), a = parseFloat(a), e > a ? a : e;
}

getApp(), getApp().api;

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: -1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var e = this, a = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), t = getApp().core.getStorageSync(getApp().const.CUSTOM);
        e.setData({
            share_setting: a,
            custom: t
        }), getApp().request({
            url: getApp().api.share.get_price,
            success: function(a) {
                if (0 == a.code) {
                    var t = a.data.cash_last, i = "", n = "", s = "", o = "", c = e.data.selected;
                    t && (i = t.name, n = t.mobile, s = t.bank_name, o = t.type), e.setData({
                        price: a.data.price.price,
                        cash_max_day: a.data.cash_max_day,
                        pay_type: a.data.pay_type,
                        bank: a.data.bank,
                        remaining_sum: a.data.remaining_sum,
                        name: i,
                        mobile: n,
                        bank_name: s,
                        selected: c,
                        check: o,
                        cash_service_charge: a.data.cash_service_charge,
                        service_content: a.data.service_content,
                        pay_type_list: a.data.pay_type_list
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {},
    formSubmit: function(a) {
        var t = this, i = parseFloat(parseFloat(a.detail.value.cash).toFixed(2)), n = t.data.price;
        if (-1 != t.data.cash_max_day && (n = e(n, t.data.cash_max_day)), i) if (i > n) getApp().core.showToast({
            title: "提现金额不能超过" + n + "元",
            image: "/images/icon-warning.png"
        }); else if (i < parseFloat(t.data.share_setting.min_money)) getApp().core.showToast({
            title: "提现金额不能低于" + page.data.share_setting.min_money + "元",
            image: "/images/icon-warning.png"
        }); else {
            var s = t.data.selected;
            if (0 == s || 1 == s || 2 == s || 3 == s) {
                if (0 == s || 1 == s || 2 == s) {
                    if (!(p = a.detail.value.name) || void 0 == p) return void getApp().core.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(c = a.detail.value.mobile) || void 0 == c) return void getApp().core.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    });
                }
                if (2 == s) {
                    if (!(o = a.detail.value.bank_name) || void 0 == o) return void getApp().core.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else o = "";
                if (3 == s) var o = "", c = "", p = "";
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.apply,
                    method: "POST",
                    data: {
                        cash: i,
                        name: p,
                        mobile: c,
                        bank_name: o,
                        pay_type: s,
                        scene: "CASH",
                        form_id: a.detail.formId
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(a) {
                                a.confirm && 0 == e.code && getApp().core.redirectTo({
                                    url: "/pages/cash-detail/cash-detail"
                                });
                            }
                        });
                    }
                });
            } else getApp().core.showToast({
                title: "请选择提现方式",
                image: "/images/icon-warning.png"
            });
        } else getApp().core.showToast({
            title: "请输入提现金额",
            image: "/images/icon-warning.png"
        });
    },
    showCashMaxDetail: function() {
        getApp().core.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function(e) {
        var a = e.currentTarget.dataset.index;
        a != this.data.check && this.setData({
            name: "",
            mobile: "",
            bank_name: ""
        }), this.setData({
            selected: a
        });
    }
});