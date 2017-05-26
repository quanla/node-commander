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

        this.getInitDir().then((dir) => this.changeFolder(dir));

        this.keyHandlers = [
            { key: keys.BACKSPACE, action: () => {
                this.goUpFolder()
            }},
            { key: keys.UP, action: () => {
                const {files, focusedFile, path} = this.state;

                let index = Cols.indexOf(files, (f) => f.fileName == focusedFile);
                if (index > 0) {
                    this.focusFile(files[index - 1].fileName);
                } else if (path != "/") {
                    this.focusFile("..");
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
                    this.focusFile(files[index + 1].fileName);
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
                this.exec(this.getCurrentFile());
            }},
            { key: keys.PAGE_UP, action: () => {
                this.pageUp();
            }},
            { key: keys.PAGE_DOWN, action: () => {
                let sortedFiles = this.sortedFiles();
                let index = Cols.indexOf(sortedFiles, (f) => f.fileName == this.state.focusedFile);
                index = Math.min(index + this.getPageSize(), this.state.files.length-1);

                this.focusFile(sortedFiles[index].fileName);
            }},
            { key: KeyCombo.compileCombo("cmd+up"), action: () => {
                let sortedFiles = this.sortedFiles();

                this.focusFile(this.state.path == "/" ? sortedFiles[0].fileName : "..");
            }},
            { key: KeyCombo.compileCombo("cmd+down"), action: () => {
                let sortedFiles = this.sortedFiles();

                this.focusFile(Cols.last(sortedFiles).fileName);
            }},
        ];
    }

    getCurrentDir() {
        return this.state.path;
    }
    getCurrentFile() {
        return Cols.find(this.state.files, (f) => f.fileName == this.state.focusedFile);
    }

    sync() {
        fileApi.getFiles(this.state.path).then((files) => {
            this.setState({files});
        });
    }

    getPageSize() {

        let filesPanel = ReactDOM.findDOMNode(this).querySelector(".files");
        let containerHeight = filesPanel.getBoundingClientRect().height;

        let fileHeight = filesPanel.querySelector(".file").getBoundingClientRect().height;

        return Math.floor(containerHeight / fileHeight);
    }

    pageUp() {

        // let containerBounding = filesPanel.getBoundingClientRect();
        let sortedFiles = this.sortedFiles();
        let index = Cols.indexOf(sortedFiles, (f) => f.fileName == this.state.focusedFile);
        index = Math.max(index - this.getPageSize(), -1);

        if (index == -1) {
            this.focusFile(this.state.path == "/" ? sortedFiles[0].fileName : "..");
        } else {
            this.focusFile(sortedFiles[index].fileName);
        }
    }

    focusFile(fileName) {
        // console.log(ReactDOM.findDOMNode(this).querySelector(".files .file.focused"));
        this.setState({focusedFile: fileName}, () => {
            let filesPanel = ReactDOM.findDOMNode(this).querySelector(".files");
            let containerBounding = filesPanel.getBoundingClientRect();
            let targetBounding = filesPanel.querySelector(".file.focused").getBoundingClientRect();

            if (targetBounding.top < containerBounding.top) {
                filesPanel.scrollTop += targetBounding.top - containerBounding.top;
            } else if (targetBounding.bottom > containerBounding.bottom) {
                filesPanel.scrollTop += targetBounding.bottom - containerBounding.bottom;
            }
        });
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
            this.props.storage.set("dir", path);
            this.setState({files, focusedFile: focused || (path != "/" ? ".." : files[0].fileName)});
        });
    }

    icon(file) {
        return file.directory ? "/src/assets/icons/Folder-icon.png" : "/src/assets/icons/file-icon.png";
    }

    sortedFiles() {
        return this.state.files;
    }

    getInitDir() {
        let dir = this.props.storage.get("dir");
        if (dir == null) {
            return fileApi.getHomeDir();
        } else {
            return Promise.resolve(dir);
        }
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

                    {files && this.sortedFiles().map((file) => (
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