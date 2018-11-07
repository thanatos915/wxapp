var e = null;

if ("undefined" != typeof wx) e = wx; else {
    e = my;
    var t = my.getSystemInfoSync;
    e.getSystemInfoSync = function() {
        return t();
    };
    var n = my.setStorageSync;
    e.setStorageSync = function(e, t) {
        return n({
            key: e,
            data: t
        });
    };
    var a = my.getStorageSync;
    e.getStorageSync = function(e) {
        var t = a({
            key: e
        });
        return t ? t.data : t;
    };
    var o = my.removeStorageSync;
    e.removeStorageSync = function(e) {
        o({
            key: e
        });
    }, e.request = function(e) {
        if ("get" == e.method.toLowerCase() && e.data) {
            var t = getApp().helper.objectToUrlParams(e.data, !0);
            e.url += "&" + t, e.data = null;
        }
        my.httpRequest(e);
    }, e.setNavigationBarColor = function(e) {}, e.setNavigationBarTitle = function(e) {
        e.title && my.setNavigationBar({
            title: e.title
        });
    };
    var c = my.showToast;
    e.showToast = function(e) {
        if (e.title) return c({
            type: "none",
            content: e.title
        });
    };
    var i = my.previewImage;
    e.previewImage = function(e) {
        if (e.current) {
            var t = e.urls.indexOf(e.current);
            return -1 == t && (t = 0), i({
                current: t,
                urls: e.urls
            });
        }
        return i({
            urls: e.urls
        });
    };
    var r = my.createAnimation;
    e.createAnimation = function(e) {
        return r({
            duration: e.duration ? e.duration : 400,
            timeFunction: e.timingFunction ? e.timingFunction : "linear",
            delay: e.delay ? e.delay : 0,
            transformOrigin: e.transformOrigin ? e.transformOrigin : "50% 50% 0"
        });
    }, e.showModal = function(e) {
        0 == e.showCancel ? my.alert({
            title: e.title,
            content: e.content,
            buttonText: e.confirmText ? e.confirmText : "确定",
            success: function(t) {
                e.success({
                    confirm: !0,
                    cancel: !1
                });
            },
            fail: e.fail,
            complete: e.complete
        }) : my.confirm({
            title: e.title,
            content: e.content,
            confirmButtonText: e.confirmText ? e.confirmText : "确定",
            cancelButtonText: e.cancelText ? e.cancelText : "取消",
            success: function(t) {
                t.confirm ? e.success({
                    confirm: !0,
                    cancel: !1
                }) : e.success({
                    confirm: !1,
                    cancel: !0
                });
            },
            fail: e.fail,
            complete: e.complete
        });
    }, e.requestPayment = function(e) {
        my.tradePay({
            tradeNO: e._res.data.trade_no || "",
            success: function(e) {},
            fail: function(e) {},
            complete: function(t) {
                var n = {};
                switch (t.resultCode = parseInt(t.resultCode), t.resultCode) {
                  case 9e3:
                    "function" == typeof e.success && e.success({
                        errMsg: "requestPayment:ok"
                    }), n.errMsg = "requestPayment:ok";
                    break;

                  case 6001:
                  case 6002:
                    "function" == typeof e.fail && e.fail({
                        errMsg: "requestPayment:fail cancel"
                    }), n.errMsg = "requestPayment:fail cancel";
                    break;

                  default:
                    "function" == typeof e.fail && e.fail({
                        errMsg: "requestPayment:fail"
                    }), n.errMsg = "requestPayment:fail";
                }
                "function" == typeof e.complete && e.complete(n);
            }
        });
    }, e.setClipboardData = function(e) {
        e.text = e.data || "", my.setClipboard(e);
    };
    var s = my.makePhoneCall;
    e.makePhoneCall = function(e) {
        e.number = e.phoneNumber || "", s(e);
    }, e.getSetting = function(e) {};
    var u = my.saveImage;
    e.saveImageToPhotosAlbum = function(e) {
        u({
            url: e.filePath,
            success: e.success,
            fail: function(t) {
                t.errMsg = t.errorMessage || "", e.fail(t);
            },
            complete: e.complete
        });
    };
    var l = my.downloadFile;
    e.downloadFile = function(e) {
        l({
            url: e.url,
            success: function(t) {
                e.success({
                    tempFilePath: t.apFilePath
                });
            },
            fail: e.fail,
            complete: e.complete
        });
    }, e.setClipboardData = function(e) {
        my.setClipboard({
            text: e.data,
            success: e.success,
            fail: e.fail,
            complete: e.complete
        });
    };
    var f = my.chooseImage;
    e.chooseImage = function(e) {
        f({
            success: function(t) {
                if ("function" == typeof e.success) {
                    var n = {
                        tempFilePaths: [],
                        tempFiles: []
                    };
                    for (var a in t.apFilePaths) n.tempFilePaths.push(t.apFilePaths[a]), n.tempFiles.push({
                        path: t.apFilePaths[a]
                    });
                    e.success(n);
                }
            },
            error: function(t) {
                "function" == typeof e.error && e.error(t);
            },
            complete: function(t) {
                "function" == typeof e.complete && e.complete(t);
            }
        });
    };
    var m = my.showActionSheet;
    e.showActionSheet = function(e) {
        m({
            items: e.itemList || [],
            success: function(t) {
                "function" == typeof e.success && e.success({
                    tapIndex: t.index
                });
            }
        });
    };
    var y = my.uploadFile;
    e.uploadFile = function(e) {
        e.fileName = e.name || "", e.fileType = e.fileType || "image", y(e);
    };
}

module.exports = e;