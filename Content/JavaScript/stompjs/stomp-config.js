"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StompConfig = void 0;
/**
 * Configuration options for STOMP Client, each key corresponds to
 * field by the same name in {@link Client}. This can be passed to
 * the constructor of {@link Client} or to [Client#configure]{@link Client#configure}.
 *
 * There used to be a class with the same name in `@stomp/ng2-stompjs`, which has been replaced by
 * {@link RxStompConfig} and {@link InjectableRxStompConfig}.
 *
 * Part of `@stomp/stompjs`.
 */
class StompConfig {
    /**
     * See [Client#brokerURL]{@link Client#brokerURL}.
     */
    brokerURL;
    /**
     * See See [Client#stompVersions]{@link Client#stompVersions}.
     */
    stompVersions;
    /**
     * See [Client#webSocketFactory]{@link Client#webSocketFactory}.
     */
    webSocketFactory;
    /**
     * See [Client#connectionTimeout]{@link Client#connectionTimeout}.
     */
    connectionTimeout;
    /**
     * See [Client#reconnectDelay]{@link Client#reconnectDelay}.
     */
    reconnectDelay;
    /**
     * See [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}.
     */
    heartbeatIncoming;
    /**
     * See [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
     */
    heartbeatOutgoing;
    /**
     * See [Client#splitLargeFrames]{@link Client#splitLargeFrames}.
     */
    splitLargeFrames;
    /**
     * See [Client#forceBinaryWSFrames]{@link Client#forceBinaryWSFrames}.
     */
    forceBinaryWSFrames;
    /**
     * See [Client#appendMissingNULLonIncoming]{@link Client#appendMissingNULLonIncoming}.
     */
    appendMissingNULLonIncoming;
    /**
     * See [Client#maxWebSocketChunkSize]{@link Client#maxWebSocketChunkSize}.
     */
    maxWebSocketChunkSize;
    /**
     * See [Client#connectHeaders]{@link Client#connectHeaders}.
     */
    connectHeaders;
    /**
     * See [Client#disconnectHeaders]{@link Client#disconnectHeaders}.
     */
    disconnectHeaders;
    /**
     * See [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
     */
    onUnhandledMessage;
    /**
     * See [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
     */
    onUnhandledReceipt;
    /**
     * See [Client#onUnhandledFrame]{@link Client#onUnhandledFrame}.
     */
    onUnhandledFrame;
    /**
     * See [Client#beforeConnect]{@link Client#beforeConnect}.
     */
    beforeConnect;
    /**
     * See [Client#onConnect]{@link Client#onConnect}.
     */
    onConnect;
    /**
     * See [Client#onDisconnect]{@link Client#onDisconnect}.
     */
    onDisconnect;
    /**
     * See [Client#onStompError]{@link Client#onStompError}.
     */
    onStompError;
    /**
     * See [Client#onWebSocketClose]{@link Client#onWebSocketClose}.
     */
    onWebSocketClose;
    /**
     * See [Client#onWebSocketError]{@link Client#onWebSocketError}.
     */
    onWebSocketError;
    /**
     * See [Client#logRawCommunication]{@link Client#logRawCommunication}.
     */
    logRawCommunication;
    /**
     * See [Client#debug]{@link Client#debug}.
     */
    debug;
    /**
     * See [Client#discardWebsocketOnCommFailure]{@link Client#discardWebsocketOnCommFailure}.
     */
    discardWebsocketOnCommFailure;
    /**
     * See [Client#onChangeState]{@link Client#onChangeState}.
     */
    onChangeState;
}
exports.StompConfig = StompConfig;
//# sourceMappingURL=stomp-config.js.map