import {modals} from "../common/components/modal/modals";
import {GmComponent} from "../common/gm-component";
import {bookmarkService} from "./bookmark-service";
export const BookmarksShowCmd = {
    showBookmarks({onChangeDir}) {
        modals.openModal({
            content: (
                <BookmarksShowModal onChangeDir={onChangeDir}/>
            )
        });
    }
};


class BookmarksShowModal extends GmComponent {

    render() {
        const {onChangeDir, onClose} = this.props;
        return (
            <div className="">
                {bookmarkService.getBookmarks().map((bookmark, i) => (
                    <div
                        className=""
                        onClick={() => {
                            onChangeDir(bookmark.cmd.substring(3));
                            onClose();
                        }}
                        key={i}>
                        {bookmark.name}
                    </div>
                ))}
            </div>
        );
    }
}