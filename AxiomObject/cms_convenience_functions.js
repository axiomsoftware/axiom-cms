function _gIR(k, d) {
    var v = this._gR(k,d);
    return parseInt(v);
}
function _gR(k, d) {
    var v = req.data[k];
    if (!v) { return d; }
    return v;
}
