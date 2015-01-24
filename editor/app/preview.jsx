var React = require('react');

var GamePreview = React.createClass({
    render: function() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <title>{this.props.appName}</title>
                    <script src="handle-errors.js"></script>
                </head>
                <body>

                    <script src="../demos/hello_world/js/base.js"></script>
                    <script src="../build/micron.js"></script>
                    <script dangerouslySetInnerHTML={{__html: this.props.code}}></script>
                </body>
            </html>
        );
    }
});

var lastWindow = null;

function doPreview(doc, appName, code) {
    var GamePreviewComponent = React.createFactory(GamePreview);

    var html = React.renderToStaticMarkup(GamePreviewComponent({
        appName: appName,
        code: code
    }));

    doc.write(html);
}

module.exports = function (appName, code, iframe) {
    var params = [
        'width='+ window.innerWidth,
        'height='+ window.innerHeight,
        'scrollbars=no',
        'toolbar=no',
        'menubar=no',
        'location=no',
        'status=no'
    ].join(',');

    var doc;

    if (iframe) {
        doc = iframe.contentDocument;
    } else {
        if (lastWindow) {
            lastWindow.close();
        }

        lastWindow = window.open('', '', params);
        doc = lastWindow.document;
    }

    doPreview(doc, appName, code);
}
