var e, a, t;

getApp();

Page({
    data: {},
    onLoad: function(n) {
        var r = new Date(), o = r.getFullYear(), c = r.getMonth() + 1;
        a = r.getDate();
        var g, i = r.getDay(), S = 7 - (a - i) % 7;
        1 == c || 3 == c || 5 == c || 7 == c || 8 == c || 10 == c || 12 == c ? g = 31 : 4 == c || 6 == c || 9 == c || 11 == c ? g = 30 : 2 == c && (g = (o - 2e3) % 4 == 0 ? 29 : 28), 
        null != getApp().core.getStorageSync("calendarSignData") && "" != getApp().core.getStorageSync("calendarSignData") || getApp().core.setStorageSync("calendarSignData", new Array(g)), 
        null != getApp().core.getStorageSync("calendarSignDay") && "" != getApp().core.getStorageSync("calendarSignDay") || getApp().core.setStorageSync("calendarSignDay", 0), 
        e = getApp().core.getStorageSync("calendarSignData"), t = getApp().core.getStorageSync("calendarSignDay"), 
        this.setData({
            year: o,
            month: c,
            nbsp: S,
            monthDaySize: g,
            date: a,
            calendarSignData: e,
            calendarSignDay: t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        e[a] = a, t += 1, getApp().core.setStorageSync("calendarSignData", e), getApp().core.setStorageSync("calendarSignDay", t), 
        getApp().core.showToast({
            title: "签到成功",
            icon: "success",
            duration: 2e3
        }), this.setData({
            calendarSignData: e,
            calendarSignDay: t
        });
    }
});