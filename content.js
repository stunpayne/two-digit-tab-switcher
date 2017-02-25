/*  Called when a key is pressed
    If the key is Command, then tell the extension to start listening for more key presses
    If it is a digit, tell the server to switch the tab
*/
function onKeyPressed(event)
{
    console.log("Key Pressed")
        //  If Mac Command is clicked
    if (event.keyCode == 91)
    {
        console.log("COMMAND PRESSED");
        chrome.runtime.sendMessage(
        {
            type: 'start_listening',
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
        chrome.runtime.sendMessage(
        {
            type: 'switch',
            greeting: "hello",
            eventKeyCode: event.keyCode
        }, function(response)
        {
            console.log(response);
        });
    }
}

/*  Called when a key is released
    If the key is Command, then stop listening for more key events
*/
function onSwitchKeyReleased(event)
{
    console.log("Key Released")
        //  If Mac Command is clicked
    if (event.keyCode == 91)
    {
        console.log("COMMAND RELEASED");
        chrome.runtime.sendMessage(
        {
            type: 'stop_listening',
            greeting: "goodbye"
        }, function(response)
        {
            console.log(response);
        });
        // window.removeEventListener("keydown", onKeyPressed);
    }
}

//  Register initial listeners
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onSwitchKeyReleased);
console.log("Reloaded Tab Switch Plugin");