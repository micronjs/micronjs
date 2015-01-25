var React = require('react');
var Bootstrap = require('react-bootstrap');
var ButtonToolbar = Bootstrap.ButtonToolbar;
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var Glyphicon = Bootstrap.Glyphicon;
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Error = require('./error.jsx');

var CodeMirror = require('../vendor/codemirror.js');
var preview = require('./preview.jsx');

var JSHINT = require('jshint').JSHINT;
var jshintrc = require('./jshintrc.js');

var helloDemo = require('raw!../demo/hello.js');

module.exports = React.createClass({
    editor: null,
    value: helloDemo,

    getInitialState: function() {
        return {
            errors: []
        };
    },

    getAppName: function () {
        return document.getElementById('app-name').textContent;
    },

    doJsHint: function () {
        var editor = this.editor,
            result = JSHINT(this.value, jshintrc),
            currentErrors = this.state.errors,
            i = 0,
            error;

        for (i = 0; i < currentErrors.length; i ++) {
            error = currentErrors[i];

            if (!error.runtime) {
                editor.removeLineClass(error.line - 1, 'background', 'errors');
            }
        }

        if (result) {
            this.setState({ errors: [] });
            return true;
        }

        for (i = 0; i < JSHINT.errors.length; i ++) {
            error = JSHINT.errors[i];
            editor.addLineClass(error.line - 1, 'background', 'errors');
        }

        this.setState({ errors: JSHINT.errors });
        return false;
    },

    run: function (element) {
        var appName = this.getAppName(),
            value = this.value;

        if (this.doJsHint()) {
            setTimeout(function () {
                preview(appName, value, element);
            }, 0);
        }
    },

    onRun: function () {
        var el = document.getElementById('preview');
        this.run(el);
    },

    onRunInNewWindow: function () {
        this.run();
    },

    onPreviewRuntimeError: function (e) {
        this.setState({ errors: [e] });
    },

    shouldComponentUpdate: function () {
        return true;
    },

    componentDidMount: function () {
        var that = this,
            node = document.getElementById('source-code');

        node.value = that.value;

        that.editor = CodeMirror.fromTextArea(node, {
            mode:  "javascript",
            lineNumbers: true,
            showCursorWhenSelecting: true
        });

        that.editor.on('change', function (cm, change) {
            cm.removeLineClass(change.to.line, 'background', 'errors');

            that.value = cm.getValue();
        });
    },

    render: function() {
        window.onPreviewError = this.onPreviewRuntimeError;

        var errors = [], error;
        for (var i=0; i < this.state.errors.length; i++) {
            error = this.state.errors[i];

            errors.push(
                <Error key={i} value={error}></Error>
            );
        }

        return (
            <div className="editor-wrapper">
                <Grid className="tools" fluid={true}>
                    <Row className="show-grid">
                        <Col xs={12} md={3}>
                            <strong>App name</strong>
                            <br/>
                            <span id="app-name" contentEditable dangerouslySetInnerHTML={{ __html: "My Game"}}></span>
                        </Col>

                        <Col xs={12} md={9}>
                            <ButtonToolbar>
                                <Button bsStyle="primary" onClick={this.onRun}>Run <Glyphicon glyph="play" /></Button>

                                <Button bsStyle="primary" onClick={this.onRunInNewWindow}>
                                    Run in new window <Glyphicon glyph="play" />
                                </Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>

                <Grid className="editor-windows" fluid={true}>
                    <Col xs={12} md={6} className={ errors.length ? 'has-errors' : '' }>
                        <textarea id="source-code"></textarea>

                        <div id="errors-panel" className={ errors.length ? 'row-fluid' : 'row-fluid hidden' }>
                        {errors}
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <iframe id="preview"></iframe>
                    </Col>
                </Grid>
            </div>
        );
    }
});
