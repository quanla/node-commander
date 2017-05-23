import classnames from "classnames";
import {GmComponent} from "../common/gm-component";
import {fileApi} from "../api/file-api";

export class CommanderPanel extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            path: "/Users/quanle/Downloads/A History of Violence (2005) [1080p]",
            files: null,
        };

        fileApi.getFiles(this.state.path).then((files) => {
            this.setState({files});
        });
    }

    handleKeyDown(e) {
        if (e.keyCode == 8) {
            this.changeFolder(this.state.path.replace(new RegExp("\\/[^/]+$"), ""));
        }
    }

    changeFolder(path) {
        this.setState({path, files: null});
        fileApi.getFiles(path).then((files) => {
            this.setState({files});
        });
    }

    render() {
        const {files} = this.state;
        return (
            <div className="commander-panel" tabIndex={0} onKeyDown={(e) => this.handleKeyDown(e)}>
                {files && files.map((file) => (
                    <div className="file" key={file.fileName}>
                        {file.fileName}
                    </div>
                ))}
            </div>
        );
    }
}