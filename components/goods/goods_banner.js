module.exports = {
    currentPage: null,
    init: function(o) {
        var e = this;
        e.currentPage = o, void 0 === o.onGoodsImageClick && (o.onGoodsImageClick = function(o) {
            e.onGoodsImageClick(o);
        });
    },
    onGoodsImageClick: function(o) {
        var e = this.currentPage, t = [], i = o.currentTarget.dataset.index;
        for (var r in e.data.goods.pic_list) t.push(e.data.goods.pic_list[r]);
        getApp().core.previewImage({
            urls: t,
            current: t[i]
        });
    }
};