import classnames from "classnames";
import {GmComponent} from "../common/gm-component";
import {fileApi} from "../api/file-api";
import {Cols} from "../common/utils/cols";
import {keys} from "../common/keys/keys";
import {KeyCombo} from "../common/keys/key-combo";

export class CommanderPanel extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            path: null,
            files: null,
            focusedFile: null,
        };

        setTimeout(() => this.changeFolder("/Users/quanle/Downloads/A History of Violence (2005) [1080p]"));

        this.keyHandlers = [
            { key: keys.BACKSPACE, action: () => {
                this.goUpFolder()
            }},
            { key: keys.UP, action: () => {
                const {files, focusedFile, path} = this.state;

                let index = Cols.indexOf(files, (f) => f.fileName == focusedFile);
                if (index > 0) {
                    this.setState({focusedFile: files[index - 1].fileName});
                } else if (path != "/") {
                    this.setState({focusedFile: ".."})
                }
            }},
            { key: keys.DOWN, action: () => {
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
            }},
            { key: KeyCombo.compileCombo("shift+cmd+enter"), action: () => {
                this.props.actions.setCmd(`${this.state.path}/${this.state.focusedFile}`);
            }},
            { key: keys.ENTER, action: () => {
                if (this.state.focusedFile == "..") {
                    this.goUpFolder();
                    return;
                }
                let file = Cols.find(this.state.files, (f) => f.fileName == this.state.focusedFile);
                this.exec(file);
            }},
        ];
    }

    exec(file) {
        if (file.directory) {
            this.changeFolder(`${this.state.path == "/" ? "" : this.state.path}/${file.fileName}`);
        } else {
            fileApi.openFile(`${this.state.path == "/" ? "" : this.state.path}/${file.fileName}`);
        }
    }

    goUpFolder() {
        let regExp = new RegExp("\\/([^/]+)$");
        let currentFolder = regExp.exec(this.state.path)[1];
        let newPath = this.state.path.replace(regExp, "");
        this.changeFolder(newPath.length == 0 ? "/" : newPath, currentFolder);
    }

    changeFolder(path, focused) {
        this.setState({path, files: null, focusedFile: null});
        fileApi.getFiles(path).then((files) => {
            this.setState({files, focusedFile: focused || (path != "/" ? ".." : files[0].fileName)});
        });
    }

    icon(file) {
        return file.directory ? "/src/assets/icons/Folder-icon.png" : "/src/assets/icons/file-icon.png";
    }

    render() {
        const {files, focusedFile, path} = this.state;
        const {focused, onMouseDown} = this.props;
        return (
            <div className={classnames("commander-panel", {focused})}
                 onMouseDown={onMouseDown}
            >
                <div className="path">
                    {path}
                </div>
                <div className="files">
                    {path != "/" && (
                        <div
                            className={classnames("file", {focused : focusedFile == ".."})}
                            onMouseDown={() => this.setState({focusedFile: ".."})}
                            onDoubleClick={() => this.goUpFolder()}
                        >
                            ..
                        </div>
                    )}

                    {files && files.map((file) => (
                        <div
                            className={classnames("file", {focused : focusedFile == file.fileName})}
                            key={file.fileName}
                            onMouseDown={() => this.setState({focusedFile: file.fileName})}
                            onDoubleClick={() => this.exec(file)}
                        >
                            <img className="icon" src={this.icon(file)}/>

                            {file.fileName}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}