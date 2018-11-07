module.exports = {
    init: function(t) {
        var e = this;
        e.currentPage = t, e.setNavi(), void 0 === t.cutover && (t.cutover = function(t) {
            e.cutover(t);
        });
    },
    setNavi: function() {
        var t = this.currentPage;
        "pages/index/index" == this.getCurrentPageUrl() && t.setData({
            home_icon: !0
        }), getApp().getConfig(function(e) {
            var i = e.store.quick_navigation;
            i.home_img || (i.home_img = "/images/quick-home.png"), t.setData({
                setnavi: i
            });
        });
    },
    getCurrentPageUrl: function() {
        var t = getCurrentPages();
        return t[t.length - 1].route;
    },
    cutover: function() {
        var t = this.currentPage;
        t.setData({
            quick_icon: !t.data.quick_icon
        });
        var e = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), i = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), a = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), o = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), n = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        getApp().getConfig(function(r) {
            var c = t.data.store, p = -55;
            t.data.quick_icon ? (c.option && c.option.wxapp && c.option.wxapp.pic_url && (n.translateY(p).opacity(1).step(), 
            p -= 55), c.show_customer_service && 1 == c.show_customer_service && c.service && (o.translateY(p).opacity(1).step(), 
            p -= 55), c.option && c.option.web_service && (a.translateY(p).opacity(1).step(), 
            p -= 55), 1 == c.dial && c.dial_pic && (i.translateY(p).opacity(1).step(), p -= 55), 
            e.translateY(p).opacity(1).step()) : (e.opacity(0).step(), a.opacity(0).step(), 
            i.opacity(0).step(), o.opacity(0).step(), n.opacity(0).step()), t.setData({
                animationPlus: e.export(),
                animationcollect: a.export(),
                animationPic: i.export(),
                animationTranspond: o.export(),
                animationInput: n.export()
            });
        });
    }
};