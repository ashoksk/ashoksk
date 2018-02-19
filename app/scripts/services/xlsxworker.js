/* xlsx.js (C) 2013-2015 SheetJS -- http://sheetjs.com */
/* uncomment the next line for encoding support */
//importScripts('dist/cpexcel.js');
importScripts('scripts/services/jszip.js');
importScripts('scripts/services/xlsx.js');
/* uncomment the next line for ODS support */
importScripts('scripts/services//ods.js');
postMessage({
    t: "ready"
});

onmessage = function (oEvent) {
    var v;
    try {
        v = XLSX.read(oEvent.data.d, {
            type: oEvent.data.b ? 'binary' : 'base64'
        });
    } catch (e) {
        postMessage({
            t: "e",
            d: e.stack || e
        });
    }
    postMessage({
        t: "xlsx",
        d: JSON.stringify(v)
    });
};