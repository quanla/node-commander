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
            8: () => this.goUpFolder(),
            38: () => {
                const {files, focusedFile, path} = this.state;

                let index = Cols.indexOf(files, (f) => f.fileName == focusedFile);
                if (index > 0) {
                    this.setState({focusedFile: files[index - 1].fileName});
                } else if (path && path.indexOf("/") > -1) {
                    this.setState({focusedFile: ".."})
                }
            },
            40: () => {
                const {files, focusedFile} = this.state;

                if (focusedFile == "..") {
                    if (files.length) {
                        this.setState({focusedFile: files[0].fileName});
                    }
                    return;
                }
                let index = Cols.indexOf(files, (f) => f.fileName == focusedFile);
                if (index < files.length - 1) {
                    this.setState({focusedFile: files[index + 1].fileName});
                }
            },
            13: () => {
                if (this.state.focusedFile == "..") {
                    this.goUpFolder();
                    return;
                }
                let file = Cols.find(this.state.files, (f) => f.fileName == this.state.focusedFile);
                if (file.directory) {
                    this.changeFolder(`${this.state.path}/${this.state.focusedFile}`);
                } else {
                    fileApi.openFile(`${this.state.path}/${this.state.focusedFile}`);
                }
            },
        };
    }

    goUpFolder() {
        this.changeFolder(this.state.path.replace(new RegExp("\\/[^/]+$"), ""));
    }

    changeFolder(path) {
        this.setState({path, files: null, focusedFile: null});
        fileApi.getFiles(path).then((files) => {
            this.setState({files, focusedFile: files.length == 0 ? null :  files[0].fileName});
        });
    }

    icon(file) {
        return file.directory ? "/src/assets/icons/Folder-icon.png" : "/src/assets/icons/file-icon.png";
    }

    render() {
        const {files, focusedFile, path} = this.state;
        const {focused, onClick} = this.props;
        return (
            <div className={classnames("commander-panel", {focused})}
                 onClick={onClick}
            >
                {path && path.indexOf("/") > -1 && (
                    <div
                        className={classnames("file", {focused : focusedFile == ".."})}
                        onClick={() => this.setState({focusedFile: ".."})}
                        onDoubleClick={() => this.goUpFolder()}
                    >
                        ..
                    </div>
                )}

                {files && files.map((file) => (
                    <div
                        className={classnames("file", {focused : focusedFile == file.fileName})}
                        key={file.fileName}
                        onClick={() => this.setState({focusedFile: file.fileName})}
                        onDoubleClick={() => fileApi.openFile(`${path}/${file.fileName}`)}
                    >
                        <img className="icon" src={this.icon(file)}/>

                        {file.fileName}
                    </div>
                ))}
            </div>
        );
    }
}