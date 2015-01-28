window.onerror = function (e) {
    var onPreviewError = window.top.onPreviewError || window.opener.onPreviewError || function(){};

    onPreviewError({
        runtime: true,
        reason: e
    });
};

window.abort = function () {
    var onAbort = window.top.onAbort || window.opener.onAbort || function(){};
    onAbort();
};

