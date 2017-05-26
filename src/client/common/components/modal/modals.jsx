import {GmComponent} from "../../../common/gm-component";
import {Modal} from "./modal";

export class ModalsRegistry extends GmComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            modalList: []
        };

        /**
         *
         * @param options {{className, content, size}}
         * @returns {{dismiss: (function()), close: (function(*=)), result: Promise}}
         */
        modals.openModal = (options) => {
            let modalOptions = {
                options,
                resolve: null
            };
            this.state.modalList.push(modalOptions);
            this.forceUpdate();

            let result = new Promise((resolve, reject)=> {
                modalOptions.resolve = resolve;
            });
            return {
                dismiss: ()=> {
                    this.dismiss(modalOptions);
                },
                close: (result) => {
                    this.close(modalOptions, result);
                },
                result: result
            };
        };
    }

    dismiss(modal) {
        _.remove(this.state.modalList, modal);
        modal.resolve();
        this.forceUpdate();
    }
    close(modal, result) {
        _.remove(this.state.modalList, modal);
        modal.resolve(result);
        this.forceUpdate();
    }

    render() {

        return (
            <div>
                { this.state.modalList.map((modal, i)=> (
                    <Modal
                        className={modal.options.className}
                        content={modal.options.content}
                        onDismiss={()=> this.dismiss(modal)}
                        onClose={(result)=> this.close(modal, result)}
                        size={modal.options.size || "md"}
                        onLink={modal.options.link}
                        key={i}
                    />
                )) }
            </div>
        );
    }
}

export const modals = {
    openModal(options) {}
};