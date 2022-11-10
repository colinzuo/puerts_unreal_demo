"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StompController = exports.gStompController = exports.StompControllerConfig = void 0;
const stompjs_1 = require("../stompjs");
const message_util_1 = require("./message-util");
class StompControllerConfig {
    brokerURL;
    login = "guest";
    passcode = "guest";
    controllerId;
}
exports.StompControllerConfig = StompControllerConfig;
const controllerEndpointPrefix = "/controller";
class StompController {
    brokerURL;
    login;
    passcode;
    controllerId;
    started = false;
    stompClient;
    _traceTag = "StompController";
    _endpoints;
    constructor(conf) {
        this._endpoints = {};
        this.configure(conf);
        this.registerEndpoint({
            appDestination: `${controllerEndpointPrefix}/ping`,
            callback: this.onPing.bind(this),
        });
        exports.gStompController = this;
    }
    registerEndpoint(params) {
        console.log(`${this._traceTag} registerEndpoint appDestination ${params.appDestination}`);
        this._endpoints[params.appDestination] = params;
    }
    start() {
        if (this.started) {
            throw new Error("Already started?");
        }
        this.started = true;
        this.stompClient = new stompjs_1.Client({
            brokerURL: this.brokerURL,
            connectHeaders: {
                login: this.login,
                passcode: this.passcode,
            },
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            // Subscriptions should be done inside onConnect as those need to reinstated when the broker reconnects
            onConnect: (frame) => {
                console.log(`${this._traceTag} onConnect Enter`);
                // The return object has a method called `unsubscribe`
                const subscription = this.stompClient.subscribe(`/topic/stomp-controller-${this.controllerId}`, this.onControllerMessage.bind(this));
            },
        });
        this.stompClient.activate();
    }
    replyErrorIfNeeded(params) {
        const { inMessage } = params;
        if (!message_util_1.MessageUtil.okToReply(inMessage)) {
            return;
        }
        this.replyError(params);
    }
    replyError(params) {
        const { inMessage, errorMsg } = params;
        this.sendMessage({
            inMessage,
            outMessage: {
                jsonBody: {
                    error: {
                        message: errorMsg
                    }
                }
            }
        });
    }
    sendMessage(params) {
        const { inMessage, outMessage } = params;
        if (inMessage) {
            outMessage.destination = inMessage.headers.replyDestination;
            outMessage.headers = outMessage.headers || {};
            outMessage.headers.appDestination = inMessage.headers.replyAppDestination;
            outMessage.headers.streamId = inMessage.headers.streamId;
        }
        this.stompClient.publish(outMessage);
    }
    //////////////////////// private //////////////////////////////////////
    configure(conf) {
        // bulk assign all properties to this
        Object.assign(this, conf);
    }
    onControllerMessage(message) {
        let appDestination = message.headers.appDestination;
        let errorMsg;
        if (!appDestination) {
            errorMsg = "message missing appDestination header";
            console.error(`${this._traceTag} ${errorMsg}`);
            this.replyErrorIfNeeded({
                inMessage: message,
                errorMsg,
            });
            return;
        }
        let endpoint = this._endpoints[appDestination];
        if (!endpoint) {
            errorMsg = `no endpoint registered at ${appDestination}`;
            console.error(`${this._traceTag} ${errorMsg}`);
            this.replyErrorIfNeeded({
                inMessage: message,
                errorMsg,
            });
            return;
        }
        endpoint.callback(message);
    }
    onPing(inMessage) {
        this.sendMessage({
            inMessage,
            outMessage: {
                jsonBody: {
                    timestamp: new Date().toISOString(),
                    controllerId: this.controllerId,
                }
            }
        });
    }
}
exports.StompController = StompController;
//# sourceMappingURL=stomp-controller.js.map