var t = require("./../../../components/area-picker/area-picker.js");

getApp(), getApp().api;

Page({
    data: {},
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = this;
        a.getDistrictData(function(e) {
            t.init({
                page: a,
                data: e
            });
        }), getApp().core.showLoading({
            title: "正在加载"
        }), getApp().request({
            url: getApp().api.mch.user.setting,
            success: function(t) {
                getApp().core.hideLoading(), a.setData(t.data);
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
    mchCommonCatChange: function(t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        });
    },
    formSubmit: function(t) {
        var e = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), t.detail.value.form_id = t.detail.formId, t.detail.value.mch_common_cat_id = e.data.mch_common_cat_index ? e.data.mch_common_cat_list[e.data.mch_common_cat_index].id : e.data.mch && e.data.mch.mch_common_cat_id ? e.data.mch.mch_common_cat_id : "", 
        getApp().request({
            url: getApp().api.mch.user.setting_submit,
            method: "post",
            data: t.detail.value,
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                }) : e.showToast({
                    title: t.msg
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
    uploadLogo: function() {
        var t = this;
        getApp().uploader.upload({
            start: function(t) {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(e) {
                0 == e.code ? (t.data.mch.logo = e.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: e.msg
                });
            },
            error: function(e) {
                t.showToast({
                    title: e
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    uploadHeaderBg: function() {
        var t = this;
        getApp().uploader.upload({
            start: function(t) {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(e) {
                0 == e.code ? (t.data.mch.header_bg = e.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: e.msg
                });
            },
            error: function(e) {
                t.showToast({
                    title: e
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});