import {modals} from "../common/components/modal/modals";
import {GmComponent} from "../common/gm-component";
const {fileApi} = require("../api/file-api");

export const MakeDirCmd = {
    makeDir(fromDir) {
        // path,
        let modal = modals.openModal({
            content: (
                <MakeDirModal fromDir={fromDir}/>
            ),
            link: (elem) => elem.querySelector("input").focus()
        });

        return modal.result.then((path) => {
            if (path == null) {
                return null;
            }

            return fileApi.makeDir(path, fromDir);
        });
    }
};

class MakeDirModal extends GmComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            path: ""
        };

    }

    render() {
        const {path} = this.state;
        const {fromDir, onClose} = this.props;
        return (
            <div className="">
                <div className="">
                    Create directory in {fromDir}
                </div>
                <input value={path} onChange={(e) => this.setState({path: e.target.value})} />

                <button onClick={() => onClose(path)}>OK</button>
            </div>
        );
    }
}