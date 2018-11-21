var e = require("../../../components/area-picker/area-picker.js");
// pages/join.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        district: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (t) {
        getApp().page.onLoad(this, t);
        var i = this;
        i.getDistrictData(function (t) {
            e.init({
                page: i,
                data: t
            });
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getDistrictData: function (e) {
        var t = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!t) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function (i) {
                getApp().core.hideLoading(), 0 == i.code && (t = i.data, getApp().core.setStorageSync(getApp().const.DISTRICT, t),
                    e(t));
            }
        });
        e(t);
    },
    onAreaPickerConfirm: function (e) {
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
    inputBlur: function (e) {
        var t = '{"' + e.currentTarget.dataset.name + '":"' + e.detail.value + '"}';
        this.setData(JSON.parse(t));
    },
    saveJoin: function () {
        var e = this, t = /^(\d{3,4}-\d{6,9})$/, i = /^\+?\d[\d -]{8,12}\d/;
        if (!/^([0-9]{6,12})$/.test(e.data.mobile) && !t.test(e.data.mobile) && !i.test(e.data.mobile)){
            return getApp().core.showToast({
                title: "联系电话格式不正确"
            });
        }

        if (e.data.district == null) {
            return getApp().core.showToast({
                title: "请选择地区"
            }), !1;
        }

        if (e.data.community.length <= 0) {
            return getApp().core.showToast({
                title: "请输入小区名"
            }), !1;
        }
        if (e.data.name.length <= 0) {
            return getApp().core.showToast({
                title: "请输入姓名"
            }), !1;
        }

        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        });
        var a = e.data.district;
        getApp().request({
            url: getApp().api.shop.join,
            method: "post",
            data: {
                name: e.data.name,
                mobile: e.data.mobile,
                province: a.province.id,
                city: a.city.id,
                district: a.district.id,
                community: e.data.community
            },
            success: function (t) {
                getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                }), 1 == t.code && e.showToast({
                    title: t.msg
                });
            }
        });
    },
})