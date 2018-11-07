var t = require("./../../components/area-picker/area-picker.js");

getApp(), getApp().api;

Page({
    data: {
        is_form_show: !1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = this;
        a.getDistrictData(function(e) {
            t.init({
                page: a,
                data: e
            });
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.apply,
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code && (t.data.apply && (t.data.show_result = !0), 
                a.setData(t.data), t.data.apply || a.setData({
                    is_form_show: !0
                }));
            }
        });
    },
    getDistrictData: function(t) {
        var e = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!e) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function(a) {
                getApp().core.hideLoading(), 0 == a.code && (e = a.data, getApp().core.setStorageSync(getApp().const.DISTRICT, e), 
                t(e));
            }
        });
        t(e);
    },
    onAreaPickerConfirm: function(t) {
        this.setData({
            edit_district: {
                province: {
                    id: t[0].id,
                    name: t[0].name
                },
                city: {
                    id: t[1].id,
                    name: t[1].name
                },
                district: {
                    id: t[2].id,
                    name: t[2].name
                }
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    mchCommonCatChange: function(t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        });
    },
    applySubmit: function(t) {
        var e = this;
        !e.data.entry_rules || e.data.agree_entry_rules ? (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 === e.data.mch_common_cat_index && (e.data.mch_common_cat_index = "0"), getApp().request({
            url: getApp().api.mch.apply_submit,
            method: "post",
            data: {
                realname: t.detail.value.realname,
                tel: t.detail.value.tel,
                name: t.detail.value.name,
                province_id: t.detail.value.province_id,
                city_id: t.detail.value.city_id,
                district_id: t.detail.value.district_id,
                address: t.detail.value.address,
                mch_common_cat_id: e.data.mch_common_cat_index ? e.data.mch_common_cat_list[e.data.mch_common_cat_index].id : e.data.apply && e.data.apply.mch_common_cat_id ? e.data.apply.mch_common_cat_id : "",
                service_tel: t.detail.value.service_tel,
                form_id: t.detail.formId,
                wechat_name: t.detail.value.wechat_name
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/mch/apply/apply"
                        });
                    }
                }), 1 == t.code && e.showToast({
                    title: t.msg
                });
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "请先阅读并同意《入驻协议》。",
            showCancel: !1
        });
    },
    hideApplyResult: function() {
        this.setData({
            show_result: !1,
            is_form_show: !0
        });
    },
    showApplyResult: function() {
        this.setData({
            show_result: !0
        });
    },
    showEntryRules: function() {
        this.setData({
            show_entry_rules: !0
        });
    },
    disagreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !1,
            show_entry_rules: !1
        });
    },
    agreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !0,
            show_entry_rules: !1
        });
    }
});