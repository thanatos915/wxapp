module.exports = function(t) {
    getApp().api;
    var e = getApp().core, g = getApp();
    if (t && "function" == typeof t) {
        var n = e.getStorageSync(g.const.STORE_CONFIG);
        n && t(n), g.config ? n = g.config : (getApp().trigger.add(getApp().trigger.events.callConfig, "call", function(e) {
            t(e);
        }), getApp().configReadyCall && "function" == typeof getApp().configReadyCall || (getApp().configReadyCall = function(t) {
            getApp().trigger.run(getApp().trigger.events.callConfig, function() {}, t);
        }));
    }
};