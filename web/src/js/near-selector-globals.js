Object.defineProperty(window, "localStorage", {
    value: sandboxedLocalStorage, // provided by the selector but not documented
});

Object.defineProperty(window, "open", {
    value: function (url, newTab, options) {
        console.log("open", url);
        return window.selector.open(url, newTab, options);
    },
});
