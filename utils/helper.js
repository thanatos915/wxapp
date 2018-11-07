function t(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    formatTime: function(e) {
        var n = e.getFullYear(), r = e.getMonth() + 1, o = e.getDate(), a = e.getHours(), u = e.getMinutes(), i = e.getSeconds();
        return [ n, r, o ].map(t).join("/") + " " + [ a, u, i ].map(t).join(":");
    },
    formatData: function(e) {
        var n = e.getFullYear(), r = e.getMonth() + 1, o = e.getDate();
        e.getHours(), e.getMinutes(), e.getSeconds();
        return [ n, r, o ].map(t).join("-");
    },
    scene_decode: function(t) {
        var e = (t + "").split(","), n = {};
        for (var r in e) {
            var o = e[r].split(":");
            o.length > 0 && o[0] && (n[o[0]] = o[1] || null);
        }
        return n;
    },
    time: function() {
        var t = Math.round(new Date().getTime() / 1e3);
        return parseInt(t);
    },
    objectToUrlParams: function(t, e) {
        var n = "";
        for (var r in t) n += "&" + r + "=" + (e ? encodeURIComponent(t[r]) : t[r]);
        return n.substr(1);
    },
    inArray: function(t, e) {
        return e.some(function(e) {
            return t === e;
        });
    },
    min: function(t, e) {
        return t = parseFloat(t), e = parseFloat(e), t > e ? e : t;
    },
    max: function(t, e) {
        return t = parseFloat(t), e = parseFloat(e), t < e ? e : t;
    }
};