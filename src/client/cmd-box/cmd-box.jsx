import classnames from "classnames";
import {GmComponent} from "../common/gm-component";
import {keys} from "../common/keys/keys";

export class CmdBox extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: "",
        };

        let blur = () => {

            let input = ReactDOM.findDOMNode(this).querySelector("input");
            input.blur();

            this.props.onRequestBlur();
        };
        this.keyHandlers = [
            {matcher: keys.UP  , action: blur},
            {matcher: keys.DOWN, action: blur},
            {matcher: keys.ENTER, action: () => {
                const {value} = this.state;

                if (value.startsWith("cd ")) {
                    this.props.onChangePath(value.substring(3));
                    blur();
                }
            }},
            // {matcher: keys.BACKSPACE, action: () => {
            // }},
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
            <div className="cmd-box" onClick={(e) => {e.preventDefault(); this.props.onRequestFocus(); }}>
                <input value={value} onChange={(e) => this.setState({value: e.target.value})}/>
            </div>
        );
    }
}