/*  Called when a key is pressed
    If the key is Command, then tell the extension to start listening for more key presses
    If it is a digit, tell the server to switch the tab
*/
function onKeyPressed(event)
{
    // console.log("Key Pressed")
    //  If Mac Command is clicked
    if (event.keyCode == 91 || event.keyCode == 17)
    {
        console.log("COMMAND/CTRL PRESSED");
        event.preventDefault();
        event.stopPropagation();
        chrome.runtime.sendMessage(
        {
            type: 'start_listening',
            eventKeyCode: event.keyCode,
            greeting: "hello"
        }, function(response)
        {
            console.log(response);
        });
        // window.addEventListener("keydown", onKeyPressed);
    }
    else if (event.keyCode >= 48 && event.keyCode <= 57)
    {
        console.log("DIGIT PRESSED");
        event.preventDefault();
        event.stopPropagation();
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

/*  Called when a key is released
    If the key is Command, then stop listening for more key events
*/
function onSwitchKeyReleased(event)
{
    // console.log("Key Released")
    //  If Mac Command or Win Ctrl is clicked
    if (event.keyCode == 91 || event.keyCode == 17)
    {
        console.log("COMMAND/CTRL RELEASED");
        event.preventDefault();
        event.stopPropagation();
        chrome.runtime.sendMessage(
        {
            type: 'stop_listening',
            eventKeyCode: event.keyCode,
            greeting: "goodbye"
        }, function(response)
        {
            // console.log(response);
        });
        // window.removeEventListener("keydown", onKeyPressed);
    }
}

function destructor()
{
    // Destruction is needed only once
    document.removeEventListener(destructionEvent, destructor);
    // Tear down content script: Unbind events, clear timers, restore DOM, etc.
    window.removeEventListener("keydown", onKeyPressed);
    window.removeEventListener("keyup", onSwitchKeyReleased);
    console.log("Removed previous listeners");
}

var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);


//  Register initial listeners
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onSwitchKeyReleased);
console.log("Reloaded Tab Switch Plugin");