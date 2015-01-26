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
var esprima = require('esprima');
var preview = require('./preview.jsx');

var JSHINT = require('jshint').JSHINT;
var jshintrc = require('./jshintrc.js');
var humane = require('humane-js');

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

    doValidate: function () {
        var error = {};

        try {
            esprima.parse(this.value);
        }
        catch (e) {
            error.reason = e.description;
            error.line = e.lineNumber - 1;
            error.character = e.column;

            this.setState({ errors: [error] })
            return false;
        }

        this.setState({ errors: [] });
        return true;
    },

    doJsHint: function () {
        if (!this.doValidate()) {
            return false;
        }

        var editor = this.editor,
            result = JSHINT(this.value, jshintrc),
            currentErrors = this.state.errors,
            i = 0,
            error;

        if (result) {
            this.setState({ errors: [] });
            return true;
        }

        this.setState({ errors: JSHINT.errors });
        return false;
    },

    run: function (element) {
        var appName = this.getAppName(),
            value = this.value;

        if (this.doValidate()) {
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

    onHint: function () {
        if (this.doJsHint()) {
            humane.log('Hint: no issues!');
        }
    },

    onPreviewRuntimeError: function (e) {
        this.setState({ errors: [e] });
    },

    componentWillUpdate: function (nextProps, nextState) {
        var editor = this.editor,
            currentErrors = this.state.errors,
            error,
            i;

        for (i = 0; i < currentErrors.length; i ++) {
            error = currentErrors[i];

            if (!error.runtime) {
                editor.removeLineClass(error.line - 1, 'background', 'errors');
            }
        }

        for (i = 0; i < nextState.errors.length; i ++) {
            error = nextState.errors[i];

            if ('undefined' !== typeof error.line) {
                editor.addLineClass(error.line - 1, 'background', 'errors');
            }
        }
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

                                <Button bsStyle="warning" onClick={this.onHint}>
                                    JSHint <Glyphicon glyph="check" />
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
