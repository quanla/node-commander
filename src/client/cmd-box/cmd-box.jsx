import classnames from "classnames";
import {GmComponent} from "../common/gm-component";
import {keys} from "../common/keys/keys";

export class CmdBox extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: "",
        };

        this.keyHandlers = [
            {key: keys.UP, action: () => {

                let input = ReactDOM.findDOMNode(this).querySelector("input");
                input.blur();

                this.props.onRequestBlur();
            }}
        ];
    }

    setCmd(value) {
        this.setState({value});
    }

    focus() {
        let input = ReactDOM.findDOMNode(this).querySelector("input");
        input.focus();
        input.select();
    }

    render() {
        const {value} = this.state;

        return (
            <div className="cmd-box">
                <input value={value} onChange={(e) => this.setState({value: e.target.value})}/>
            </div>
        );
    }
}