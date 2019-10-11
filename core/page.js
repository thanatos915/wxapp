module.exports = {
    currentPage: null,
    currentPageOptions: {},
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    onLoad: function(e, t) {
        this.currentPage = e, this.currentPageOptions = t;
        var o = this;
        this.setUserInfo(), this.setWxappImg(), this.setStore(), this.setParentId(t), this.getNavigationBarColor(),
        this.setDeviceInfo(), this.setPageClasses(), this.setPageNavbar(), this.setBarTitle(),
        "function" == typeof e.onSelfLoad && e.onSelfLoad(t), o._setFormIdSubmit(), "undefined" != typeof my && "pages/login/login" != e.route && t && (e.options || (e.options = t),
        getApp().core.setStorageSync("last_page_options", t)), e.navigatorClick = function(t) {
            o.navigatorClick(t, e);
        }, e.setData({
            __platform: getApp().platform,
            _navigation_bar_color: getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR)
        }), void 0 === e.showToast && (e.showToast = function(e) {
            o.showToast(e);
        }), getApp().shareSendCoupon = function(e) {
            o.shareSendCoupon(e);
        }, void 0 === e.setTimeList && (e.setTimeList = function(e) {
            return o.setTimeList(e);
        }), void 0 === e.showLoading && (e.showLoading = function(e) {
            o.showLoading(e);
        }), void 0 === e.hideLoading && (e.hideLoading = function(e) {
            o.hideLoading(e);
        }), void 0 === e.modalConfirm && (e.modalConfirm = function(e) {
            o.modalConfirm(e);
        }), void 0 === e.modalClose && (e.modalClose = function(e) {
            o.modalClose(e);
        }), void 0 === e.modalShow && (e.modalShow = function(e) {
            o.modalShow(e);
        }), void 0 === e.myLogin && (e.myLogin = function() {
            o.myLogin();
        }), void 0 === e.getUserInfo && (e.getUserInfo = function(e) {
            o.getUserInfo(e);
        }), void 0 === e.getPhoneNumber && (e.getPhoneNumber = function(e) {
            o.getPhoneNumber(e);
        }), void 0 === e.bindParent && (e.bindParent = function(e) {
            o.bindParent(e);
        });
        wx.getStorage({
            key: 'cart_count',
            success (res) {
                e.setData({
                    cart_count: res.data
                })
            }
        });
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().orderPay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    onPullDownRefresh: function(e) {
        this.currentPage = e;
    },
    onReachBottom: function(e) {
        this.currentPage = e;
    },
    onShareAppMessage: function(e) {
        this.currentPage = e, getApp().shareSendCoupon(e);
    },
    imageClick: function(e) {
        console.log("image click", e);
    },
    textClick: function(e) {
        console.log("text click", e);
    },
    tap1: function(e) {
        console.log("tap1", e);
    },
    tap2: function(e) {
        console.log("tap2", e);
    },
    formSubmit_collect: function(e) {
        e.detail.formId;
        console.log("formSubmit_collect--\x3e", e);
    },
    setUserInfo: function() {
        var e = this.currentPage, t = getApp().getUser();
        t && e.setData({
            __user_info: t
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            t.setData({
                __wxapp_img: e.wxapp_img,
                store: e.store
            });
        });
    },
    setStore: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            e.store && t.setData({
                store: e.store,
                __is_comment: e.store ? e.store.is_comment : 1,
                __is_sales: e.store ? e.store.is_sales : 1
            });
        });
    },
    setParentId: function(e) {
        var t = this.currentPage;
        if (e) {
            var o = 0;
            if (e.user_id) o = e.user_id; else if (e.scene) if (isNaN(e.scene)) {
                var a = decodeURIComponent(e.scene);
                a && (a = getApp().helper.scene_decode(a)) && a.uid && (o = a.uid);
            } else o = e.scene; else if (null !== getApp().query) {
                var n = getApp().query;
                o = n.uid;
            }
            o && (getApp().core.setStorageSync(getApp().const.PARENT_ID, o), getApp().trigger.remove(getApp().trigger.events.login, "TRY_TO_BIND_PARENT"),
            getApp().trigger.add(getApp().trigger.events.login, "TRY_TO_BIND_PARENT", function() {
                t.bindParent({
                    parent_id: o,
                    condition: 0
                });
            }));
        }
    },
    showToast: function(e) {
        var t = this.currentPage, o = e.duration || 2500, a = e.title || "", n = (e.success,
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: a
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof n && n();
        }, o);
    },
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], o = getApp().core.getSystemInfoSync();
        if (o.model) {
            o.model.indexOf("iPhone X") >= 0 && (o.model = "iPhone X");
            for (var a in t) t[a].model == o.model && e.setData({
                __device: t[a].id
            });
        }
    },
    setPageNavbar: function() {
        function e(e) {
            var t = !1, a = o.route || o.__route__ || null;
            for (var n in e.navs) e.navs[n].url === "/" + a ? (e.navs[n].active = !0, t = !0) : e.navs[n].active = !1;
            t && o.setData({
                _navbar: e
            });
        }
        var t = this, o = this.currentPage, a = getApp().core.getStorageSync("_navbar");
        a && e(a);
        var n = !1;
        for (var i in t.navbarPages) if (o.route == t.navbarPages[i]) {
            n = !0;
            break;
        }
        n && getApp().request({
            url: getApp().api.default.navbar,
            success: function(o) {
                0 == o.code && (e(o.data), getApp().core.setStorageSync("_navbar", o.data), t.setPageClasses());
            }
        });
    },
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && e.data._navbar.navs.length > 0 && (t += " show_navbar"),
        t && e.setData({
            __page_classes: t
        });
    },
    showLoading: function(e) {
        var t = t;
        t.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setTimeList: function(e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }
        var o = "00", a = "00", n = "00", i = 0;
        return e >= 86400 && (i = parseInt(e / 86400), e %= 86400), e < 86400 && (n = parseInt(e / 3600),
        e %= 3600), e < 3600 && (a = parseInt(e / 60), e %= 60), e < 60 && (o = e), {
            d: i,
            h: t(n),
            m: t(a),
            s: t(o)
        };
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, o = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var a in o) o[a].url === t && getApp().core.setNavigationBarTitle({
            title: o[a].title
        });
    },
    getNavigationBarColor: function() {
        var e = getApp(), t = this;
        e.request({
            url: e.api.default.navigation_bar_color,
            success: function(o) {
                0 == o.code && (e.core.setStorageSync(getApp().const.NAVIGATION_BAR_COLOR, o.data),
                t.setNavigationBarColor(), e.navigateBarColorCall && "function" == typeof e.navigateBarColorCall && e.navigateBarColorCall(o));
            }
        });
    },
    setNavigationBarColor: function() {
        var e = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR);
        e && getApp().core.setNavigationBarColor(e), getApp().navigateBarColorCall = function(e) {
            getApp().core.setNavigationBarColor(e.data);
        };
    },
    navigatorClick: function(e, t) {
        var o = e.currentTarget.dataset.open_type;
        if ("redirect" == o) return !0;
        if ("wxapp" != o) {
            if ("tel" == o) {
                var a = e.currentTarget.dataset.tel;
                getApp().core.makePhoneCall({
                    phoneNumber: a
                });
            }
            return !1;
        }
    },
    shareSendCoupon: function(e) {
        var t = getApp();
        t.core.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(o) {
            var a = o.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), a && t.core.navigateTo({
                url: a
            });
        }), t.request({
            url: t.api.coupon.share_send,
            success: function(t) {
                0 == t.code && e.setData({
                    get_coupon_list: t.data.list
                });
            },
            complete: function() {
                t.core.hideLoading();
            }
        });
    },
    bindParent: function(e) {
        var t = getApp();
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var o = t.getUser();
            t.core.getStorageSync(t.const.SHARE_SETTING).level > 0 && 0 != e.parent_id && t.request({
                url: t.api.share.bind_parent,
                data: {
                    parent_id: e.parent_id,
                    condition: e.condition
                },
                success: function(e) {
                    0 == e.code && (o.parent = e.data, t.setUser(o));
                }
            });
        }
    },
    _setFormIdSubmit: function(e) {
        var t = this.currentPage;
        t._formIdSubmit || (t._formIdSubmit = function(e) {
            console.log("_formIdSubmit e --\x3e", e);
            var o = e.currentTarget.dataset, a = e.detail.formId, n = o.bind || null, i = o.type || null, r = o.url || null, s = getApp().core.getStorageSync(getApp().const.FORM_ID_LIST);
            switch (s && s.length || (s = []), s.push({
                time: getApp().helper.time(),
                form_id: a
            }), getApp().core.setStorageSync(getApp().const.FORM_ID_LIST, s), console.log("self[bindtap]--\x3e", t[n]),
            t[n] && "function" == typeof t[n] && t[n](e), i) {
              case "navigate":
                r && getApp().core.navigateTo({
                    url: r
                });
                break;

              case "redirect":
                r && getApp().core.redirectTo({
                    url: r
                });
                break;

              case "switchTab":
                r && getApp().core.switchTab({
                    url: r
                });
                break;

              case "reLaunch":
                r && getApp().core.reLaunch({
                    url: r
                });
                break;

              case "navigateBack":
                r && getApp().core.navigateBack({
                    url: r
                });
            }
        });
    },
    modalClose: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了关闭按钮");
    },
    modalConfirm: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了确定按钮");
    },
    modalShow: function(e) {
        this.currentPage.setData({
            modal_show: !0
        }), console.log("点击会弹出弹框");
    },
    getUserInfo: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg && getApp().core.login({
            success: function(o) {
                var a = o.code;
                t.unionLogin({
                    code: a,
                    user_info: e.detail.rawData,
                    encrypted_data: e.detail.encryptedData,
                    iv: e.detail.iv,
                    signature: e.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var e = this;
        "my" === getApp().platform && my.getAuthCode({
            scopes: "auth_user",
            success: function(t) {
                e.unionLogin({
                    code: t.authCode
                });
            }
        });
    },
    closeLogin: function (){
        this.setUserInfoShowFalse()
    },
    unionLogin: function(e) {
        var t = this.currentPage, o = this;
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    t.setData({
                        __user_info: e.data
                    }), getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token),
                    getApp().trigger.run(getApp().trigger.events.login);
                    var a = getApp().core.getStorageSync(getApp().const.STORE);
                    e.data.binding || !a.option.phone_auth || a.option.phone_auth && 0 == a.option.phone_auth ? getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }) : ("undefined" == typeof wx && getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }), o.setPhone(), o.setUserInfoShowFalse());
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    getPhoneNumber: function(e) {
        var t = this.currentPage;
        "getPhoneNumber:fail user deny" == e.detail.errMsg ? getApp().core.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权"
        }) : (getApp().core.showLoading({
            title: "授权中"
        }), getApp().core.login({
            success: function(o) {
                if (o.code) {
                    var a = o.code;
                    getApp().request({
                        url: getApp().api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: e.detail.iv,
                            encryptedData: e.detail.encryptedData,
                            code: a
                        },
                        success: function(e) {
                            if (0 == e.code) {
                                var o = t.data.__user_info;
                                o.binding = e.data.dataObj, getApp().setUser(o), t.setData({
                                    PhoneNumber: e.data.dataObj,
                                    __user_info: o,
                                    binding: !0,
                                    binding_num: e.data.dataObj
                                }), getApp().core.redirectTo({
                                    url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                                });
                            } else getApp().core.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(e) {
                            getApp().core.hideLoading();
                        }
                    });
                } else getApp().core.showToast({
                    title: "获取用户登录态失败！" + o.errMsg
                });
            }
        }));
    },
    setUserInfoShow: function() {
        this.currentPage.setData({
            user_info_show: !0
        });
    },
    setPhone: function() {
        var e = this.currentPage;
        "undefined" == typeof my && e.setData({
            user_bind_show: !0
        });
    },
    setUserInfoShowFalse: function() {
        this.currentPage.setData({
            user_info_show: !1
        });
    }
};
