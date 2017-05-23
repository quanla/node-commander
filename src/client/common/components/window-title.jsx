import {GmComponent} from "../gm-component";

export class WindowTitle extends GmComponent {

    constructor(props, context) {
        super(props, context);

        let title = props.title;
        if (document.title != title) {
            document.title = title;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.title != this.props.title) {
            document.title = nextProps.title;
        }
    }

    render() {
        return null;
    }
}

