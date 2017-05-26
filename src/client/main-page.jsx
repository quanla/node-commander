import classnames from "classnames";
import {GmComponent} from "./common/gm-component";
import {CommanderPanel} from "./commander-panel/commander-panel";
import {CmdBox} from "./cmd-box/cmd-box";
import {htmlKeys, keys} from "./common/keys/keys";
import {Storage} from "./common/storage";
import {CopyCmd} from "./commands/copy";
import {DeleteCmd} from "./commands/delete";
import {MakeDirCmd} from "./commands/make-dir";

export class MainPage extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            focusedPanel: null,
            focusing: "panels",
        };

        this.onMount(() => {
            this.setState({focusedPanel: this.panels["left"]});
        });

        this.panels = {left: null, right: null};

        this.keyHandlers = [
            {matcher: keys.TAB, action: () => {
                this.setState({focusedPanel: this.state.focusedPanel == this.panels["left"] ? this.panels["right"] : this.panels["left"]});
            }},
            {matcher: keys.F5, action: () => {
                let fromPanel = this.state.focusedPanel;
                let toPanel = this.getUnfocusedPanel();
                let currentFile = fromPanel.getCurrentFile();
                CopyCmd.copy(currentFile, fromPanel.getCurrentDir(), toPanel.getCurrentDir()).then(() => {
                    this.sync();
                });
            }},
            {matcher: keys.DELETE, action: () => {
                let fromPanel = this.state.focusedPanel;
                let currentFile = fromPanel.getCurrentFile();
                DeleteCmd.del(currentFile, fromPanel.getCurrentDir()).then(() => {
                    this.sync();
                });
            }},
            {matcher: keys.F7, action: () => {
                let fromPanel = this.state.focusedPanel;
                MakeDirCmd.makeDir(fromPanel.getCurrentDir()).then((path) => {
                    if (path) {
                        fromPanel.changeFolder(path);
                    }
                });
            }},
            {matcher: keys.ESC, action: () => {
                this.cmdBox.setCmd("");
                this.focusPanels();
            }},

        ];
    }

    getUnfocusedPanel() {
        return this.state.focusedPanel == this.panels["left"] ? this.panels["right"] : this.panels["left"];
    }

    sync() {
        this.panels["left"].sync();
        this.panels["right"].sync();
    }

    handleKeyDown(e) {

        const {focusing, focusedPanel} = this.state;

        let handlerLists = [
            focusing == "panels" ? (
                focusedPanel == null ? null : focusedPanel.keyHandlers
            ) : (
                this.cmdBox.keyHandlers
            ),
            this.keyHandlers
        ];

        let keyStroke = htmlKeys.translate(e);

        function findHandler(keyStroke, handlerList) {
            for (let i = 0; i < handlerList.length; i++) {
                let handler = handlerList[i];

                if (handler.matcher(keyStroke)) {
                    return handler;
                }
            }
        }

        for (let i = 0; i < handlerLists.length; i++) {
            let handlerList = handlerLists[i];

            if (handlerList == null ) {
                continue;
            }

            let handler = findHandler(keyStroke, handlerList);
            if (handler) {
                handler.action(keyStroke);
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        console.log(e.keyCode);
    }

    setCmd(cmd) {
        this.cmdBox.setCmd(cmd);
    }

    focusCmdBox() {
        this.cmdBox.focus();
        this.setState({focusing: "cmdBox"});
    }

    focusPanels() {
        ReactDOM.findDOMNode(this).focus();
        this.setState({focusing: "panels"});
    }

    render() {

        const {focusedPanel} = this.state;

        const createCommanderPanel = (id) => {
            return (
                <CommanderPanel
                    ref={(panel)=> this.panels[id] = panel}
                    focused={focusedPanel == this.panels[id]}
                    onMouseDown={() => this.setState({focusedPanel: this.panels[id]})}
                    onFocusCmdBox={() => this.focusCmdBox()}
                    storage={Storage.createStorage(`panels.${id}`)}
                    actions={{
                        setCmd: (cmd) => {
                            this.setCmd(cmd);
                        }
                    }}
                />
            );
        };
        return (
            <div className="main-page" tabIndex={0}
                 onKeyDown={(e) => this.handleKeyDown(e)}
            >
                <div className="panels">
                    {createCommanderPanel("left")}
                    {createCommanderPanel("right")}
                </div>

                <CmdBox ref={(comp) => this.cmdBox = comp}
                        onRequestBlur={() => this.focusPanels()}
                        onRequestFocus={() => this.focusCmdBox()}
                        onChangePath={(path) => this.state.focusedPanel.changePath(path)}
                />
            </div>
        );
    }
}