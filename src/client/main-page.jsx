import classnames from "classnames";
import {GmComponent} from "./common/gm-component";
import {CommanderPanel} from "./commander-panel/commander-panel";

export class MainPage extends GmComponent {

    render() {
        return (
            <div className="main-page">
                <CommanderPanel/>
                <CommanderPanel/>
            </div>
        );
    }
}