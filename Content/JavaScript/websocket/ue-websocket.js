"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketReadyState = exports.UEWebsocket = void 0;
const UE = require("ue");
class UEWebsocket {
    onclose;
    onerror;
    onmessage;
    onopen;
    terminate;
    /**
     * Returns a string that indicates how binary data from the socket is exposed to scripts:
     * We support only 'arraybuffer'.
     */
    binaryType;
    /**
     * Returns the state of the socket connection.
     */
    readyState;
    url;
    protocols;
    _ueWebsocket;
    constructor(url, protocols, bindRawMessage = true) {
        this.url = url;
        this.protocols = protocols;
        this._ueWebsocket = UE.WebSocketFunctionLibrary.CreateWebSocket(url, protocols);
        this.readyState = WebSocketReadyState.CLOSED;
        this._ueWebsocket.OnWebSocketConnected.Add(this.OnWebSocketConnected_Internal.bind(this));
        this._ueWebsocket.OnWebSocketConnectionError.Add(this.OnWebSocketConnectionError_Internal.bind(this));
        this._ueWebsocket.OnWebSocketClosed.Add(this.OnWebSocketClosed_Internal.bind(this));
        if (bindRawMessage) {
            this._ueWebsocket.OnWebSocketRawMessageReceived.Add(this.OnWebSocketRawMessageReceived_Internal.bind(this));
        }
        else {
            this._ueWebsocket.OnWebSocketMessageReceived.Add(this.OnWebSocketMessageReceived_Internal.bind(this));
        }
    }
    connect() {
        if (this.readyState != WebSocketReadyState.CLOSED) {
            throw new Error(`State ${this.readyState} is invalid for connect`);
        }
        this.readyState = WebSocketReadyState.CONNECTING;
        this._ueWebsocket.Connect();
    }
    /**
     * Closes the connection.
     */
    close() {
        this._ueWebsocket.Close();
    }
    /**
     * Transmits data using the connection. data can be a string.
     */
    send(data) {
        if (typeof data === "string") {
            this._ueWebsocket.SendMessage(data);
        }
        else {
            this._ueWebsocket.SendRawMessage(data, true);
        }
    }
    Clear() {
        this._ueWebsocket.OnWebSocketConnected.Clear();
        this._ueWebsocket.OnWebSocketConnectionError.Clear();
        this._ueWebsocket.OnWebSocketClosed.Clear();
        this._ueWebsocket.OnWebSocketMessageReceived.Clear();
    }
    OnWebSocketConnected_Internal() {
        console.log("OnWebSocketConnected_Internal");
        if (this.onopen) {
            this.onopen();
        }
    }
    OnWebSocketConnectionError_Internal(Error) {
        console.log("OnWebSocketConnectionError_Internal");
        if (this.onerror) {
            this.onerror(Error);
        }
    }
    OnWebSocketClosed_Internal(StatusCode, Reason, bWasClean) {
        console.log("OnWebSocketClosed_Internal");
        if (this.onclose) {
            this.onclose({
                code: StatusCode,
                reason: Reason,
                wasClean: bWasClean,
            });
        }
    }
    OnWebSocketMessageReceived_Internal(Message) {
        console.log("OnWebSocketMessageReceived_Internal");
        if (this.onmessage) {
            this.onmessage({
                data: Message,
            });
        }
    }
    OnWebSocketRawMessageReceived_Internal(ArrayBuffer, BytesRemaining) {
        console.log("OnWebSocketRawMessageReceived_Internal");
        if (this.onmessage) {
            this.onmessage({
                data: ArrayBuffer,
                bytesRemaining: BytesRemaining,
            });
        }
    }
}
exports.UEWebsocket = UEWebsocket;
/**
 * Possible states for the Websocket
 */
var WebSocketReadyState;
(function (WebSocketReadyState) {
    WebSocketReadyState[WebSocketReadyState["CONNECTING"] = 0] = "CONNECTING";
    WebSocketReadyState[WebSocketReadyState["OPEN"] = 1] = "OPEN";
    WebSocketReadyState[WebSocketReadyState["CLOSING"] = 2] = "CLOSING";
    WebSocketReadyState[WebSocketReadyState["CLOSED"] = 3] = "CLOSED";
})(WebSocketReadyState = exports.WebSocketReadyState || (exports.WebSocketReadyState = {}));
//# sourceMappingURL=ue-websocket.js.map