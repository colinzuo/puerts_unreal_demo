"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versions = void 0;
/**
 * Supported STOMP versions
 *
 * Part of `@stomp/stompjs`.
 */
class Versions {
    versions;
    /**
     * Indicates protocol version 1.0
     */
    static V1_0 = '1.0';
    /**
     * Indicates protocol version 1.1
     */
    static V1_1 = '1.1';
    /**
     * Indicates protocol version 1.2
     */
    static V1_2 = '1.2';
    /**
     * @internal
     */
    static default = new Versions([
        Versions.V1_0,
        Versions.V1_1,
        Versions.V1_2,
    ]);
    /**
     * Takes an array of string of versions, typical elements '1.0', '1.1', or '1.2'
     *
     * You will an instance if this class if you want to override supported versions to be declared during
     * STOMP handshake.
     */
    constructor(versions) {
        this.versions = versions;
    }
    /**
     * Used as part of CONNECT STOMP Frame
     */
    supportedVersions() {
        return this.versions.join(',');
    }
    /**
     * Used while creating a WebSocket
     *
     * https://www.iana.org/assignments/websocket/websocket.xhtml
     */
    protocolVersions() {
        return this.versions.map(x => `v${x.replace('.', '')}.stomp`);
    }
}
exports.Versions = Versions;
//# sourceMappingURL=versions.js.map