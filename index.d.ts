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

    @param {boolean} continueOnAttach - Whether to continue after attaching.
        1 = attach, and then continue
        2 = attach only once, and then continue
*/
interface DebugBreak {
    (continueOnAttach?: unknown): void;
    called?: boolean;
    disabled?: boolean;
}
const pointlessVariableToWorkAroundBaseTypescriptDefaultExportsHandling: DebugBreak;
export default pointlessVariableToWorkAroundBaseTypescriptDefaultExportsHandling;