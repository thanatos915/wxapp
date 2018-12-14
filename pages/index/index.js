var t = require("./../../components/quick-navigation/quick-navigation.js"), o = require("./../../components/goods/specifications_model.js"), e = !0, a = 0, i = !1;

Page({
    data: {
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy: !1,
        opendate: !1,
        show_attr_picker: !1,
        goods: {},
        form: {
            number: 1
        },
        intervalArr: [],
        show_data_tip: '今日团购'
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a), this.loadData(a), t.init(this);
    },
    suspension: function() {
        var t = this;
        a = setInterval(function() {
            getApp().request({
                url: getApp().api.default.buy_data,
                data: {
                    time: t.data.time
                },
                method: "POST",
                success: function(a) {
                    if (0 == a.code) {
                        var e = !1;
                        t.data.msgHistory == a.md5 && (e = !0);
                        var o = "", i = a.cha_time, s = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
                        o = 0 == s ? i % 60 + "秒" : s + "分" + i % 60 + "秒", !e && a.cha_time <= 300 ? t.setData({
                            buy: {
                                time: o,
                                type: a.data.type,
                                url: a.data.url,
                                user: a.data.user.length >= 5 ? a.data.user.slice(0, 4) + "..." : a.data.user,
                                avatar_url: a.data.avatar_url,
                                address: a.data.address.length >= 8 ? a.data.address.slice(0, 7) + "..." : a.data.address,
                                content: a.data.content
                            },
                            msgHistory: a.md5
                        }) : t.setData({
                            buy: !1
                        });
                    }
                }
            });
        }, 1e4);
    },
    loadData: function(t) {
        var a = this, o = getApp().core.getStorageSync(getApp().const.PAGE_INDEX_INDEX);
        o && (o.act_modal_list = [], a.setData(o)), getApp().request({
            url: getApp().api.default.index,
            success: function(t) {
                0 == t.code && (e ? e = !1 : t.data.act_modal_list = [], a.setData(t.data), getApp().core.setStorageSync(getApp().const.PAGE_INDEX_INDEX, t.data), 
                a.miaoshaTimer());
                a.goodsAll({
                    currentTarget: {
                        dataset: {
                            index: 0
                        }
                    }
                });
                // 设置购物车数量
                wx.setStorage({
                    key: "cart_count",
                    data: t.data.cart_count
                })
            },
            complete: function() {
                getApp().core.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        var t = this;
        getApp().page.onShow(this), getApp().getConfig(function(a) {
            var e = a.store;
            e && e.name && getApp().core.setNavigationBarTitle({
                title: e.name
            }), e && 1 === e.purchase_frame ? t.suspension(t.data.time) : t.setData({
                buy_user: ""
            });
        }), t.notice();
    },
    onPullDownRefresh: function() {
        getApp().getStoreData(), clearInterval(o), this.loadData();
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var a = this;
        return {
            path: "/pages/index/index?user_id=" + getApp().getUser().id,
            title: a.data.store.name
        };
    },
    showshop: function(t) {
        var a = this, e = t.currentTarget.dataset.id, o = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && a.setData({
                    data: o,
                    attr_group_list: t.data.attr_group_list,
                    goods: t.data,
                    showModal: !0
                });
            }
        });
    },
    receive: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "领取中",
            mask: !0
        }), a.hideGetCoupon || (a.hideGetCoupon = function(t) {
            var e = t.currentTarget.dataset.url || !1;
            a.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: e || "/pages/list/list"
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: e
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? a.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (getApp().core.showToast({
                    title: t.msg,
                    duration: 2e3
                }), a.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this.data.notice;
        if (void 0 !== t) t.length;
    },
    miaoshaTimer: function() {
        var t = this;
        t.data.miaosha && 0 != t.data.miaosha.rest_time && (t.data.miaosha.ms_next || (o = setInterval(function() {
            t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
            t.data.miaosha.times = t.setTimeList(t.data.miaosha.rest_time), t.setData({
                miaosha: t.data.miaosha
            })) : clearInterval(o);
        }, 1e3)));
    },
    onHide: function() {
        getApp().page.onHide(this), this.setData({
            play: -1
        }), clearInterval(a);
    },
    onUnload: function() {
        getApp().page.onUnload(this), this.setData({
            play: -1
        }), clearInterval(o), clearInterval(a);
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, o = !0;
        for (var i in e) {
            var s = parseInt(i);
            e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && o && (o = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    },
    naveClick: function(t) {
        var a = this;
        getApp().navigatorClick(t, a);
    },
    play: function(t) {
        this.setData({
            play: t.currentTarget.dataset.index
        });
    },
    onPageScroll: function(t) {
        var a = this;
        if (!i && -1 != a.data.play) {
            var e = getApp().core.getSystemInfoSync().windowHeight;
            "undefined" == typeof my ? getApp().core.createSelectorQuery().select(".video").fields({
                rect: !0
            }, function(t) {
                (t.top <= -200 || t.top >= e - 57) && a.setData({
                    play: -1
                });
            }).exec() : getApp().core.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function(t) {
                (t[0].top <= -200 || t[0].top >= e - 57) && a.setData({
                    play: -1
                });
            });
        }
    },
    fullscreenchange: function(t) {
        i = !!t.detail.fullScreen;
    },
    goodsAll: function(a) {
        var e = this, s = a.currentTarget.dataset.index, c = e.data.cat_list, i = null;
        for (var o in c) o == s ? (c[o].active = !0, i = c[o]) : c[o].active = !1;
        if (e.setData({
            page: 1,
            goods_list: [],
            list: [],
            show_no_data_tip: !1,
            cat_list: c,
            current_cat: i
        }), void 0 === ("undefined" == typeof my ? "undefined" : t(my))) {
            var n = a.currentTarget.offsetLeft, r = e.data.scrollLeft;
            r = n - 80, e.setData({
                scrollLeft: r
            });
        } else c.forEach(function(t, s, i) {
            t.id == a.currentTarget.id && (s >= 1 ? e.setData({
                toView: c[s - 1].id
            }) : e.setData({
                toView: c[s].id
            }));
        });
        e.list(i.id, 1), getApp().core.createSelectorQuery().select("#catall").boundingClientRect().exec(function(t) {
            e.setData({
                height: t[0].height
            });
        });
    },
    list: function(t, e) {
        var s = this;

        // 取消
        s.data.intervalArr.forEach(item => {
            clearInterval(item)
        });

        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), a = !1;
        var c = s.data.page || 2;
        getApp().request({
            url: getApp().api.dingshi.goods_list,
            data: {
                cat_id: t,
                page: c
            },
            success: function(e) {

                var show_data_tip = 0 == e.data.list.length ? '团购已结束' : '今日团购';
                s.setData({
                    show_data_tip: show_data_tip
                });
                // goods_list: list
                0 == e.code && (getApp().core.hideLoading(), 0 == e.data.list.length && (a = !0),
                    function () {
                        var list = []
                        var o = setInterval(function() {
                            list = e.data.list.filter(item => {
                                // item.end_time = 1542710115000
                                let date = new Date(item.end_time*1000) - new Date()
                                if (date > 0) {
                                  let hours = Math.floor(date / (3600 * 1000))
                                  let date2 = date % (3600 * 1000)
                                  let min = Math.floor(date2 / (60 * 1000))
                                  let date3 = date2 % (60 * 1000)
                                  let second = Math.round(date3 / 1000)
                                  let str = hours + '小时' + min + '分钟' + second + '秒'
                                  item.time = str
                                } else {
                                  item.time = '0小时0分钟0秒'
                                  clearInterval(o)
                                }
                                return item.end_time != ''
                            })

                            s.setData({
                                goods_list: list
                            })
                        }, 1000)
                        s.data.intervalArr.push(o);
                    }(),
                    s.setData({
                        page: c + 1
                    }), s.setData({
                        // goods_list: e.data.list
                        // // setInterval(function() {
                        //   goods_list: e.data.list.filter(item => {
                        //     item.end_time = 1542710115000
                        //     let date = new Date(item.end_time) - new Date()
                        //     let hours = Math.floor(date / (3600 * 1000))
                        //     let date2 = date % (3600 * 1000)
                        //     let min = Math.floor(date2 / (60 * 1000))
                        //     let date3 = date2 % (60 * 1000)
                        //     let second = Math.round(date3 / 1000)
                        //     let str = hours + '.' + min + '.' + second
                        //     item.end_time = str
                        //     return item.end_time != ''
                        //   })
                        // // }, 1000)
                    // goods_list: e.data.list.map(item=>{
                    //   console.log(item.end_time)
                    //   var date = new Date(item.end_time)
                    //   var date2 = `${date.getFullYear()}:${(date.getMonth() + 1).toString().padStart(2, '0')}:${date.getDate()}:${date.getMinutes()}:${date.getSeconds()}`
                    //   console.log(date2)
                    //   item.end_time = '----'
                    // })
                }), s.setData({
                    cat_id: t
                })), s.setData({
                    show_no_data_tip: 0 == s.data.goods_list.length,
                });
            },
            complete: function() {
                1 == e && getApp().core.createSelectorQuery().select("#catall").boundingClientRect().exec(function(t) {
                    s.setData({
                        height: t[0].height
                    });
                });
            }
        });
    },
    addCart: function(e) {
        this.submit("ADD_CART", e);
    },
    submit: function(t, e) {
        var a = this;
        var event = e;
        a.data.goods_list.forEach(item => {
            if (item.id == event.target.dataset.goodsId) {
                if (!a.data.show_attr_picker) {
                    a.setData({
                        show_attr_picker: !0
                    }), !0;
                    a.setData({
                        temp_goods_id: item.id,
                        goods: item,
                        attr_group_list: item.attr_group_list,
                        dingshi_data: item.dingshi.dingshi_data,
                        form: {number: 1}
                    });
                    a.selectDefaultAttr();
                    return;
                }

                if (a.data.dingshi_data && a.data.dingshi_data.rest_num > 0 && a.data.form.number > a.data.dingshi_data.rest_num) return getApp().core.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                }), !0;
                if (1e3 * a.data.goods.dingshi.begin_time > Date.parse(new Date())) return getApp().core.showToast({
                    title: "活动未开始",
                    image: "/images/icon-warning.png"
                }), !0;
                if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                }), !0;
                var e = a.data.attr_group_list, o = [];
                for (var i in e) {
                    var s = !1;
                    for (var r in e[i].attr_list) if (e[i].attr_list[r].checked) {
                        s = {
                            attr_id: e[i].attr_list[r].attr_id,
                            attr_name: e[i].attr_list[r].attr_name
                        };
                        break;
                    }
                    if (!s) return getApp().core.showToast({
                        title: "请选择" + e[i].attr_group_name,
                        image: "/images/icon-warning.png"
                    }), !0;
                    o.push({
                        attr_group_id: e[i].attr_group_id,
                        attr_group_name: e[i].attr_group_name,
                        attr_id: s.attr_id,
                        attr_name: s.attr_name
                    });
                }
                "ADD_CART" == t && (getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.cart.add_cart,
                    method: "POST",
                    data: {
                        goods_id: item.id,
                        attr: JSON.stringify(o),
                        num: a.data.form.number,
                        source: 1 // 标识定时购商品
                    },
                    success: function(t) {
                        //增加购物车数量
                        var cart_count = parseInt(a.data.cart_count) + parseInt(a.data.form.number);
                        console.log(cart_count);
                        wx.setStorage({
                            key: "cart_count",
                            data: cart_count,
                        });
                        a.setData({
                            cart_count: cart_count
                        })
                        getApp().core.showToast({
                            title: t.msg,
                            duration: 1500
                        }), getApp().core.hideLoading(), a.setData({
                            show_attr_picker: !1
                        });
                    }
                })), "BUY_NOW" == t && (a.setData({
                    show_attr_picker: !1
                }), getApp().core.redirectTo({
                    url: "/pages/order-submit/order-submit?goods_info=" + JSON.stringify({
                        goods_id: item.id,
                        attr: o,
                        num: a.data.form.number
                    })
                }));
            }
        });
        return;
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.dingshi.buy_max && 0 != t.data.goods.dingshi.buy_max) return getApp().core.showToast({
            title: "一单限购" + t.data.goods.dingshi.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > a.data.goods.dingshi.buy_max && 0 != a.data.goods.dingshi.buy_max && (getApp().core.showToast({
            title: "一单限购" + a.data.goods.dingshi.buy_max + "件",
            image: "/images/icon-warning.png"
        }), e = a.data.goods.dingshi.buy_max), a.setData({
            form: {
                number: e
            }
        });
    },
});