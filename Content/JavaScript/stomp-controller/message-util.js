"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUtil = void 0;
class MessageUtil {
    static okToReply(inMessage) {
        let replyDestination = inMessage.headers.replyDestination;
        let replyAppDestination = inMessage.headers.replyAppDestination;
        let streamId = inMessage.headers.streamId;
        if (replyDestination && replyAppDestination && streamId) {
            return true;
        }
        return false;
    }
}
exports.MessageUtil = MessageUtil;
//# sourceMappingURL=message-util.js.map