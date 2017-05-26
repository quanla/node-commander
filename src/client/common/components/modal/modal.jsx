import {GmComponent} from "../../../common/gm-component";
import {keys} from "../../keys/keys";
import classnames from "classnames";

export class Modal extends GmComponent {
    overlayElem = null;

    constructor(props, context) {
        super(props, context);
        this.state = {
            
        };

        document.body.style.overflowY = "hidden";

        // this.onUnmount(keys.onEsc(()=> {
        //     this.close();
        // }));
        this.onUnmount(()=> {
            setTimeout(()=> {
                document.body.style.overflowY = null;
            }, 300);
        });

        if (props.onLink) {
            this.onMount(() => {
                props.onLink(ReactDOM.findDOMNode(this));
            });
        }
    }

    close() {
        if (document.activeElement != document.body) {
            document.activeElement["blur"]();
        }
        this.props.onDismiss();
    }

    render() {
        const {onClose, onDismiss} = this.props;

        return (
            <div className={classnames("modal-1 modal-dialog", this.props.className, `modal-${this.props.size}`)} tabIndex={0}>
                <div className="modal-overlay"
                     onMouseDown={ (e)=> e.target == this.overlayElem && this.props.onDismiss() }
                     ref={ (elem)=> this.overlayElem = elem }
                >
                    <div className="modal-box">
                        <div className="btn-close"
                             onClick={ ()=> this.props.onDismiss() }
                        >
                            <div className="close-x">
                                &times;
                            </div>
                            <div className="close-text-cancel">
                                <i className="material-icons">arrow_back</i> Cancel
                            </div>
                        </div>

                        { typeof this.props.content.type == "function" ? (
                            React.cloneElement(this.props.content, {
                                onClose: onClose,
                                onDismiss: onDismiss,
                            })
                        ) : (
                            this.props.content
                        ) }
                    </div>
                </div>
            </div>
        );
    }
}