/**
        debugbreak has a lot of features you might not want. Depending on your use case,
            you can just do this in one (long) line:
  
            require("open")(`https://notdevtools.com/devtools/inspector.html?experiments=true&v8only=true&${require("inspector").url().replace("://", "=")}`);
  
        However, if you don't mind the instability of the extra features, you will
            get better logging, and a slightly easier to use function.


        Passing a truthy argument (such as 1) will result in the debugger continuing
            after attaching. This is useful as it allows you to add a debugger; statement
            to break in your own code, for example:

            debugbreak(1);
            debugger;
 */

const autoOpen = true;
module.allowclient = true;

let attached = false;

let g = new Function("return this")();

module.exports = function debugbreak(continueOnAttach) {
    if (typeof document !== "undefined") {
        if (continueOnAttach) return;
        debugger;
        return;
    }

    if (continueOnAttach === 2 && attached) {
        return;
    }
    attached = true;
    g.debugbreakcalled = true;

    // NOTE: Try to avoid just using require, as it might be transpiled or otherwise wrapped.
    const r = globalThis.require || require;

    let baseUrl = baseGetInspectorUrl();

    let devToolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&${baseUrl.replace("://", "=")}`;

    // NOTE: writeSync to ensure any async log shims aren't used, as we are about to
    //      stop all code execution, so async logging won't work
    r("fs").writeSync(1, `\nWaiting on\n${devToolsUrl}\n${new Error().stack.split("\n").slice(1).join("\n")}\n`);

    if (autoOpen) {
        let browserUrl = devToolsUrl.replace("devtools://devtools/bundled", "https://notdevtools.com/devtools");
        // Have to exec, or else our waiting for the debugger can/will break the open code.
        r("child_process").exec(`node -e "require('open')('${browserUrl}')"`);
    }

    if(!continueOnAttach) {
        // IMPORTANT! Refresh devtools after you continue here! (the code will block until the debugger reattaches)
        debugger;
    }
    r("inspector").waitForDebugger();
    if(!continueOnAttach) {
        debugger;
    }

    function baseGetInspectorUrl() {

        function getNextPort() {
            return 49152 + ~~((65535 - 49152) * Math.random());
        }

        let inspector = r("inspector");

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