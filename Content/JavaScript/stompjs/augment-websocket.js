"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentWebsocket = void 0;
/**
 * @internal
 */
function augmentWebsocket(webSocket, debug) {
    webSocket.terminate = function () {
        const noOp = () => { };
        // set all callbacks to no op
        this.onerror = noOp;
        this.onmessage = noOp;
        this.onopen = noOp;
        const ts = new Date();
        const origOnClose = this.onclose;
        // Track delay in actual closure of the socket
        this.onclose = closeEvent => {
            const delay = new Date().getTime() - ts.getTime();
            debug(`Discarded socket closed after ${delay}ms, with code/reason: ${closeEvent.code}/${closeEvent.reason}`);
        };
        this.close();
        origOnClose.call(this, {
            code: 4001,
            reason: 'Heartbeat failure, discarding the socket',
            wasClean: false,
        });
    };
}
exports.augmentWebsocket = augmentWebsocket;
//# sourceMappingURL=augment-websocket.js.map