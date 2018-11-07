var e = require("./../../components/area-picker/area-picker.js");

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        district: null
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var i = this;
        i.getDistrictData(function(t) {
            e.init({
                page: i,
                data: t
            });
        }), i.setData({
            address_id: t.id
        }), t.id && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.address_detail,
            data: {
                id: t.id
            },
            success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && i.setData(e.data);
            }
        }));
    },
    getDistrictData: function(e) {
        var t = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!t) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function(i) {
                getApp().core.hideLoading(), 0 == i.code && (t = i.data, getApp().core.setStorageSync(getApp().const.DISTRICT, t), 
                e(t));
            }
        });
        e(t);
    },
    onAreaPickerConfirm: function(e) {
        this.setData({
            district: {
                province: {
                    id: e[0].id,
                    name: e[0].name
                },
                city: {
                    id: e[1].id,
                    name: e[1].name
                },
                district: {
                    id: e[2].id,
                    name: e[2].name
                }
            }
        });
    },
    saveAddress: function() {
        var e = this, t = /^(\d{3,4}-\d{6,9})$/, i = /^\+?\d[\d -]{8,12}\d/;
        if (!/^([0-9]{6,12})$/.test(e.data.mobile) && !t.test(e.data.mobile) && !i.test(e.data.mobile)) return e.showToast({
            title: "联系电话格式不正确"
        }), !1;
        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        });
        var a = e.data.district;
        a || (a = {
            province: {
                id: ""
            },
            city: {
                id: ""
            },
            district: {
                id: ""
            }
        }), getApp().request({
            url: getApp().api.user.address_save,
            method: "post",
            data: {
                address_id: e.data.address_id || "",
                name: e.data.name,
                mobile: e.data.mobile,
                province_id: a.province.id,
                city_id: a.city.id,
                district_id: a.district.id,
                detail: e.data.detail
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                }), 1 == t.code && e.showToast({
                    title: t.msg
                });
            }
        });
    },
    inputBlur: function(e) {
        var t = '{"' + e.currentTarget.dataset.name + '":"' + e.detail.value + '"}';
        this.setData(JSON.parse(t));
    },
    getWechatAddress: function(e) {
        var t = this;
        getApp().core.chooseAddress({
            success: function(e) {
                "chooseAddress:ok" == e.errMsg && (getApp().core.showLoading(), getApp().request({
                    url: getApp().api.user.wechat_district,
                    data: {
                        national_code: e.nationalCode,
                        province_name: e.provinceName,
                        city_name: e.cityName,
                        county_name: e.countyName
                    },
                    success: function(i) {
                        1 == i.code && getApp().core.showModal({
                            title: "提示",
                            content: i.msg,
                            showCancel: !1
                        }), t.setData({
                            name: e.userName || "",
                            mobile: e.telNumber || "",
                            detail: e.detailInfo || "",
                            district: i.data.district
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    }
});