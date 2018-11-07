getApp().api;

var t = !1, a = !1, e = 2;

Page({
    data: {
        status: 1,
        first_count: 0,
        second_count: 0,
        third_count: 0,
        list: Array,
        no_more: !1
    },
    onLoad: function(s) {
        getApp().page.onLoad(this, s);
        var o = this, i = getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        o.setData({
            share_setting: i
        }), a = !1, t = !1, e = 2, o.GetList(s.status || 1);
    },
    GetList: function(e) {
        var s = this;
        a || (a = !0, s.setData({
            status: parseInt(e || 1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_team,
            data: {
                status: s.data.status,
                page: 1
            },
            success: function(a) {
                s.setData({
                    first_count: a.data.first,
                    second_count: a.data.second,
                    third_count: a.data.third,
                    list: a.data.list
                }), 0 == a.data.list.length && (t = !0, s.setData({
                    no_more: !0
                }));
            },
            complete: function() {
                getApp().core.hideLoading(), a = !1;
            }
        }));
    },
    onReachBottom: function() {
        t || this.loadData();
    },
    loadData: function() {
        if (!a) {
            a = !0;
            var s = this;
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), getApp().request({
                url: getApp().api.share.get_team,
                data: {
                    status: s.data.status,
                    page: e
                },
                success: function(a) {
                    s.setData({
                        first_count: a.data.first,
                        second_count: a.data.second,
                        third_count: a.data.third,
                        list: s.data.list.concat(a.data.list)
                    }), 0 == a.data.list.length && (t = !0, s.setData({
                        no_more: !0
                    }));
                },
                complete: function() {
                    getApp().core.hideLoading(), a = !1, e++;
                }
            });
        }
    }
});