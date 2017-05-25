import classnames from "classnames";
import {GmComponent} from "./common/gm-component";
import {CommanderPanel} from "./commander-panel/commander-panel";
import {CmdBox} from "./cmd-box/cmd-box";
import {htmlKeys, keys} from "./common/keys/keys";

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
            {key: keys.TAB, action: () => {
                this.setState({focusedPanel: this.state.focusedPanel == this.panels["left"] ? this.panels["right"] : this.panels["left"]});
            }}
        ];

        $(window).focus(() => {
            console.log(111);
        });
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
                if (keys.match(keyStroke, handler.key)) {
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
                handler.action();
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        // console.log(e.keyCode);
    }

    setCmd(cmd) {
        this.cmdBox.setCmd(cmd);
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
                    actions={{
                        setCmd: (cmd) => {
                            this.setCmd(cmd);
                        }
                    }}
                />
            );
        }
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
                />
            </div>
        );
    }
}