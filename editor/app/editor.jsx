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
var validate = require('./validate.js');
var hints = require('./hints.js');
var preview = require('./preview.jsx');

var humane = require('humane-js');

var helloDemo = require('raw!../demo/hello.js');

module.exports = React.createClass({
    editor: null,
    value: helloDemo,

    getInitialState: function() {
        return {
            running: false,
            runningInWindow: false,
            errors: []
        };
    },

    getAppName: function () {
        return document.getElementById('app-name').textContent;
    },

    doValidate: function () {
        var result = validate(this.value);

        if (result === true) {
            this.setState({ errors: [] });
            return true;
        }

        this.setState({ errors: result });
        return false;
    },

    doJsHint: function () {
        if (!this.doValidate()) {
            return false;
        }

        var result = hints(this.value);

        if (result === true) {
            this.setState({ errors: [] });
            return true;
        }

        this.setState({ errors: result });
        return false;
    },

    run: function (element) {
        var appName = this.getAppName(),
            value = this.value,
            stop = this.stop,
            onPreviewStop = this.onPreviewStop;

        stop();

        if (!this.doValidate()) {
            return;
        }

        setTimeout(function () {
            preview.start(appName, value, element, onPreviewStop);
        }, 0);

        this.setState({
            running: true,
            runningInWindow: !element
        });
    },

    stop: function () {
        var el = document.getElementById('preview');
        preview.stop(el);

        this.setState({ running: false });
    },

    onRun: function () {
        var el = document.getElementById('preview');
        this.run(el);
    },

    onStop: function () {
        this.stop();
    },

    onRunInNewWindow: function () {
        this.run();
    },

    onHint: function () {
        if (this.doJsHint()) {
            humane.log('Hint: no issues!');
        }
    },

    onPreviewStop: function () {
        this.stop();
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
                console.log(error.line);
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
        window.onAbort = this.onStop;

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
                                <Button bsStyle="primary" onClick={this.onRun}>
                                    Run <Glyphicon glyph="play" />
                                </Button>

                                <Button bsStyle="primary" onClick={this.onRunInNewWindow}>
                                    Run in new window <Glyphicon glyph="play" />
                                </Button>

                                <Button bsStyle="danger" disabled={!this.state.running} onClick={this.onStop}>
                                    Stop <Glyphicon glyph="stop" />
                                </Button>

                                <Button onClick={this.onHint}>
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
