/*  Called when a key is pressed
    If the key is Command, then tell the extension to start listening for more key presses
    If it is a digit, tell the server to switch the tab
*/
function onKeyPressed(event)
{
    // console.log("Key Pressed")
    //  If Mac Command is clicked
    if (event.metaKey && event.keyCode >= 48 && event.keyCode <= 57)
    {
        console.log("Preventing default action");
        event.preventDefault();
        event.stopPropagation();

        console.log("DIGIT PRESSED");
        chrome.runtime.sendMessage(
        {
            type: 'switch',
            greeting: "hello",
            eventKeyCode: event.keyCode
        }, function(response)
        {
            // console.log(response);
        });
    }
}

/*  Destructor method to remove all event listeners
    on reloading/re-enabling the plugin
*/
function destructor()
{
    // Destruction is needed only once
    document.removeEventListener(destructionEvent, destructor);
    // Tear down content script: Unbind events, clear timers, restore DOM, etc.
    window.removeEventListener("keydown", onKeyPressed);
    // window.removeEventListener("keyup", onSwitchKeyReleased);
    console.log("Removed previous listeners");
}

var destructionEvent = 'destruct_extension_two_digit_tab_switcher';
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);


//  Register initial listeners
window.addEventListener("keydown", onKeyPressed);
// window.addEventListener("keyup", onSwitchKeyReleased);
console.log("Reloaded Tab Switch Plugin");