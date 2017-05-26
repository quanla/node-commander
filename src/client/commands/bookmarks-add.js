import {modals} from "../common/components/modal/modals";
import {GmComponent} from "../common/gm-component";
import {bookmarkService} from "./bookmark-service";
const Path = require("path");
export const BookmarksAddCmd = {
    showBookmarksAddDialog(dir) {
        modals.openModal({
            content: (
                <BookmarksAddModal dir={dir}/>
            )
        }).result.then((bookmark) => {
            bookmarkService.addBookmark(bookmark);
        });
    }
};

class BookmarksAddModal extends GmComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            cmd: `cd ${props.dir}`,
            name: Path.basename(props.dir),
        };
    }

    render() {
        const {onClose} = this.props;
        const {cmd, name} = this.state;

        return (
            <div className="">
                <div className="">
                    {cmd}
                </div>

                <div className="">
                    {name}
                </div>

                <div className="">
                    <button onClick={() => onClose({cmd, name})}>OK</button>
                </div>
            </div>
        );
    }
}