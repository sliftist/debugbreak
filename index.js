const autoOpen = true;
module.allowclient = true;

module.exports = function debugBreakpoint(continueOnAttach) {
    if (typeof document !== "undefined") {
        debugger;
        return;
    }

    let baseUrl = baseGetInspectorUrl();

    let devToolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&${baseUrl.replace("://", "=")}`;

    // NOTE: globalThis.require to ensure transpilers don't try to bundle our imports
    // NOTE: writeSync to ensure any async log shims aren't used, as we are about to
    //      stop all code execution, so async logging won't work
    globalThis.require("fs").writeSync(1, `\nWaiting on\n${devToolsUrl}\n${new Error().stack.split("\n").slice(1).join("\n")}\n`);

    if (autoOpen) {
        let browserUrl = devToolsUrl.replace("devtools://devtools/bundled", "https://notdevtools.com");
        // Have to exec, or else our waiting for the debugger can/will break the open code.
        globalThis.require("child_process").exec(`node -e "require('open')('${browserUrl}')"`);
    }

    if(!continueOnAttach) {
        // IMPORTANT! Refresh devtools after you continue here! (the code will block until the debugger reattaches)
        debugger;
    }
    globalThis.require("inspector").waitForDebugger();
    if(!continueOnAttach) {
        debugger;
    }

    function baseGetInspectorUrl() {

        function getNextPort() {
            return 49152 + ~~((65535 - 49152) * Math.random());
        }

        let inspector = eval("require")("inspector");

        while (true) {
            let url = inspector.url();
            if (url) return url;
            try {
                inspector.open(getNextPort());
            } catch {
                continue;
            }
        }
    }
};