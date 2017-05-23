import classnames from "classnames";
import {GmComponent} from "../common/gm-component";
import {fileApi} from "../api/file-api";
import {Cols} from "../common/utils/cols";

export class CommanderPanel extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            path: null,
            files: null,
            focusedFile: null,
        };

        setTimeout(() => this.changeFolder("/Users/quanle/Downloads/A History of Violence (2005) [1080p]"));

        this.keyHandlers = {
            8: () => this.changeFolder(this.state.path.replace(new RegExp("\\/[^/]+$"), "")),
            38: () => {
                let index = Cols.indexOf(this.state.files, (f) => f.fileName == this.state.focusedFile);
                if (index > 0) {
                    this.setState({focusedFile: this.state.files[index - 1].fileName});
                }
            },
            40: () => {
                let index = Cols.indexOf(this.state.files, (f) => f.fileName == this.state.focusedFile);
                if (index < this.state.files.length - 1) {
                    this.setState({focusedFile: this.state.files[index + 1].fileName});
                }
            },
        };
    }

    changeFolder(path) {
        this.setState({path, files: null, focusedFile: null});
        fileApi.getFiles(path).then((files) => {
            this.setState({files, focusedFile: files.length == 0 ? null :  files[0].fileName});
        });
    }

    render() {
        const {files, focusedFile} = this.state;
        const {focused, onClick} = this.props;
        return (
            <div className={classnames("commander-panel", {focused})}
                 onClick={onClick}
            >
                {files && files.map((file) => (
                    <div className={classnames("file", {focused : focusedFile == file.fileName})} key={file.fileName}>
                        {file.fileName}
                    </div>
                ))}
            </div>
        );
    }
}