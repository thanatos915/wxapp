Page({
    data: {
        address_list: []
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var e = this;
        getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.user.address_list,
            success: function(t) {
                getApp().core.hideNavigationBarLoading(), 0 == t.code && e.setData({
                    address_list: t.data.list
                }), e.setData({
                    show_no_data_tip: 0 == e.data.address_list.length
                });
            }
        });
    },
    setDefaultAddress: function(e) {
        var t = this, s = e.currentTarget.dataset.index, a = t.data.address_list[s];
        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.address_set_default,
            data: {
                address_id: a.id
            },
            success: function(e) {
                if (getApp().core.hideLoading(), 0 == e.code) {
                    var a = t.data.address_list;
                    for (var d in a) a[d].is_default = d == s ? 1 : 0;
                    t.setData({
                        address_list: a
                    });
                }
            }
        });
    },
    deleteAddress: function(e) {
        var t = e.currentTarget.dataset.id;
        e.currentTarget.dataset.index;
        getApp().core.showModal({
            title: "提示",
            content: "确认删除改收货地址？",
            success: function(e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在删除",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.user.address_delete,
                    data: {
                        address_id: t
                    },
                    success: function(e) {
                        0 == e.code && getApp().core.redirectTo({
                            url: "/pages/address/address"
                        }), 1 == e.code && (getApp().core.hideLoading(), getApp().core.showToast({
                            title: e.msg
                        }));
                    }
                }));
            }
        });
    }
});