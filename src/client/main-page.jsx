import classnames from "classnames";
import {GmComponent} from "./common/gm-component";
import {CommanderPanel} from "./commander-panel/commander-panel";

export class MainPage extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            focusedPanel: null,
        };

        this.onMount(() => {
            this.setState({focusedPanel: this.leftPanel});
        });


        this.keyHandlers = {
            9: () => this.setState({focusedPanel: this.state.focusedPanel == this.leftPanel ? this.rightPanel : this.leftPanel}),
        };
    }

    handleKeyDown(e) {

        let handlerMaps = [this.state.focusedPanel.keyHandlers, this.keyHandlers];

        for (let i = 0; i < handlerMaps.length; i++) {
            let handlerMap = handlerMaps[i];

            let handler = handlerMap[e.keyCode];
            if (handler) {
                handler();
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        console.log(e.keyCode);
    }

    render() {
        const {focusedPanel} = this.state;
        return (
            <div className="main-page" tabIndex={0}
                 onKeyDown={(e) => this.handleKeyDown(e)}
            >
                <CommanderPanel
                    ref={(panel)=> this.leftPanel = panel}
                    focused={focusedPanel==this.leftPanel}
                    onClick={() => this.setState({focusedPanel: this.leftPanel})}
                />
                <CommanderPanel
                    ref={(panel)=> this.rightPanel = panel}
                    focused={focusedPanel==this.rightPanel}
                    onClick={() => this.setState({focusedPanel: this.rightPanel})}
                />
            </div>
        );
    }
}