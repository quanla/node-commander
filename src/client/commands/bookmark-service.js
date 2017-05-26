const {Storage} = require("../common/storage");

let storage = Storage.createStorage("bookmarks");

let bookmarks = storage.get("list") || [];

const bookmarkService = {
    addBookmark(bookmark) {
        bookmarks.push(bookmark);
        storage.set("list", bookmarks);
    },
    getBookmarks() {
        return bookmarks;
    }
};

exports.bookmarkService = bookmarkService;