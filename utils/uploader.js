module.exports = {
    upload: function(e) {
        function t(t) {
            "function" == typeof e.start && e.start(t), wx.uploadFile({
                url: e.url || o.api.default.upload_image,
                filePath: t.path,
                name: e.name || "image",
                formData: e.data || {},
                success: function(t) {
                    200 == t.statusCode ? "function" == typeof e.success && (t.data = JSON.parse(t.data), 
                    e.success(t.data)) : "function" == typeof e.error && e.error("上传错误：" + t.statusCode + "；" + t.data), 
                    e.complete();
                },
                fail: function(t) {
                    "function" == typeof e.error && e.error(t.errMsg), e.complete();
                }
            });
        }
        var o = getApp();
        (e = e || {}).complete = e.complete || function() {}, e.data = e.data || {}, wx.chooseImage({
            count: 1,
            success: function(o) {
                if (o.tempFiles && o.tempFiles.length > 0) {
                    var a = o.tempFiles[0];
                    t(a);
                } else "function" == typeof e.error && e.error("请选择文件"), e.complete();
            },
            fail: function(t) {
                "function" == typeof e.error && (e.error("请选择文件"), e.complete());
            }
        });
    }
};