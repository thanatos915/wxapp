Page({
    data: {
        args: !1,
        page: 1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.scratch.prize,
            data: {
                page: 1
            },
            success: function(a) {
                0 == a.code && t.setData({
                    list: a.data
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var t = this;
        if (!t.data.args) {
            var a = t.data.page + 1;
            getApp().request({
                url: getApp().api.scratch.prize,
                data: {
                    page: a
                },
                success: function(e) {
                    0 == e.code ? t.setData({
                        list: t.data.list.concat(e.data),
                        page: a
                    }) : t.data.args = !0;
                }
            });
        }
    },
    submit: function(t) {
        var a = t.currentTarget.dataset.gift, e = JSON.parse(t.currentTarget.dataset.attr), o = t.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/order-submit/order-submit?scratch_id=" + o + "&goods_info=" + JSON.stringify({
                goods_id: a,
                attr: e,
                num: 1
            })
        });
    }
});