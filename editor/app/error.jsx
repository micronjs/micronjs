var React = require('react');

module.exports = React.createClass({
    render: function () {
        var error = this.props.value;

        if (error.runtime) {
            return (
                <div>
                Runtime error: <em>{error.reason}</em>
                </div>
            )
        }

        return (
            <div>
            line {error.line-1}, character {error.character}: <em>{error.reason}</em>
            </div>
        )

    }
});
