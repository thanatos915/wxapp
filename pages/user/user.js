Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    loadData: function(e) {
        var t = this;
        t.setData({
            store: getApp().core.getStorageSync(getApp().const.STORE)
        }), getApp().request({
            url: getApp().api.user.index,
            success: function(e) {
                0 == e.code && ("my" == t.data.__platform && e.data.menus.forEach(function(t, o, a) {
                    "bangding" === t.id && e.data.menus.splice(o, 1, 0);
                }), t.setData(e.data), getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, e.data),
                getApp().core.setStorageSync(getApp().const.SHARE_SETTING, e.data.share_setting),
                getApp().core.setStorageSync(getApp().const.USER_INFO, e.data.user_info));
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this), this.loadData();
    },
    callTel: function(e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function(e) {
        var t = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), o = getApp().getUser();
        1 == t.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != t.share_condition && 2 != t.share_condition || (0 == o.is_distributor ? getApp().core.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(a) {
                a.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: e.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == t.share_condition ? (o.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (o.is_distributor = 1, getApp().core.navigateTo({
                            url: "/pages/share/index"
                        })), getApp().core.setStorageSync(getApp().const.USER_INFO, o));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(e) {
        getApp().core.scanCode({
            onlyFromCamera: !1,
            success: function(e) {
                getApp().core.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function(e) {
                getApp().core.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        getApp().core.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(e) {
        getApp().permission_list && getApp().permission_list.length && function(e, t) {
            return -1 != ("," + e.join(",") + ",").indexOf("," + t + ",");
        }(getApp().permission_list, "integralmall") && getApp().core.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },
    closeLogin: function (){
        this.setData({
            user_info_show: !1
        })
    },
});
