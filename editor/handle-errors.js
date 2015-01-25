window.onerror = function (e) {
    var onPreviewError = window.top.onPreviewError || window.opener.onPreviewError || function(){};

    onPreviewError({
        runtime: true,
        reason: e
    });
};
