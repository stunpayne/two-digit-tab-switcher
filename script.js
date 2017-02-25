//  Is extension listening for digit press events
var isListening = false;
//  Has the first digit of the tab index already been set
var isFirstNumberPressed = false;
//  First digit of the two-digit tab index
var lastDigit = 0;
//  Timer that listens for second digit of tab index
var timer = null;


/*  Called when a key is pressed after the Command key
    If the key is a digit and is pressed for the first time then it is stored as
    the first digit of the tab index and a timer for 0.7seconds is created to 
    listen for the second digit. If received, the combined two-digit tab index
    is switched to, if it exists, else the timer is killed.
*/
function getTabIndex(keyCode)
{
    var finalTabIndex = 0;
    var currDigit = 0;
    console.log("isFirstNumberPressed: " + isFirstNumberPressed);
    //  If Mac Command is clicked
    if (keyCode >= 48 && keyCode <= 57)
    {
        currDigit = keyCode - 48;
        if (!isFirstNumberPressed)
        {
            finalTabIndex = currDigit;
            lastDigit = currDigit;
            isFirstNumberPressed = true;
            console.log("NUMBER " + keyCode + " CLICKED");
            timer = setTimeout(function()
            {
                if (isFirstNumberPressed)
                    isFirstNumberPressed = false;
            }, 700);
        }
        else
        {
            finalTabIndex = lastDigit * 10 + currDigit;
            lastDigit = 0;
            if (timer != null)
                window.clearTimeout(timer);
            timer = null;
            isFirstNumberPressed = false;
        }
        return finalTabIndex;
    }
    else
    {
        console.log("NON-NUMBER " + keyCode + " CLICKED");
    }
    return -1;
}

/*  Handling corner and special cases for the index
    If there is no such case, then return the index less 1
*/
function cleanIndex(index, tabs)
{
    if (index == 0)
        return tabs.length - 1;
    else if (index > tabs.length)
        return -1;
    else
        return index - 1;
}

/*  Create listener for messages from content scripts
    Three types of messages can be received:
    1)  start_listening - The command key has been clicked and its now time to
        start listening for digits corresponding to tab indices
    2)  stop_listening - The command key has been released and its now time to
        stop listening for digits
    3)  switch - A number has been received from the content script which needs
        to be processed to decide the index of the tab to switch to
*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse)
    {
        switch (request.type)
        {
            case 'start_listening':
                isListening = true;
                console.log('Now Listening');
                break;

            case 'stop_listening':
                isListening = false;
                console.log('Not Listening')
                break;

            case 'switch':
                if (isListening)
                {
                    console.log(request);
                    var index = getTabIndex(request.eventKeyCode);
                    console.log('Tab index to switch to: ' + index);

                    //  Switch tab on current window only
                    chrome.windows.getCurrent(function(window)
                    {
                        //  Query for all tabs on this window
                        chrome.tabs.query(
                        {
                            'windowId': window.id
                        }, function(tabs)
                        {
                            index = cleanIndex(index, tabs);
                            if (index != -1)
                            {
                                //  Update the active tab to the one pointed to 
                                //  by the index
                                chrome.tabs.update(tabs[index].id,
                                {
                                    'active': true
                                }, function(tab)
                                {
                                    console.log('Updated');
                                })
                            }
                        });
                    });
                }
                break;

            default:
                console.log("Incorrect request type received: " + request.type)
                break;
        }
        //  Just something learned from the tutorial
        if (request.greeting == "hello")
            sendResponse(
            {
                farewell: "goodbye"
            });
    });


// Add a `manifest` property to the `chrome` object.
chrome.manifest = chrome.app.getDetails();

var injectIntoTab = function (tab) {
    // You could iterate through the content scripts here
    var scripts = chrome.manifest.content_scripts[0].js;
    var i = 0, s = scripts.length;
    for( ; i < s; i++ ) {
        chrome.tabs.executeScript(tab.id, {
            file: scripts[i]
        });
    }
}

// Get all windows
chrome.windows.getAll({
    populate: true
}, function (windows) {
    var i = 0, w = windows.length, currentWindow;
    for( ; i < w; i++ ) {
        currentWindow = windows[i];
        var j = 0, t = currentWindow.tabs.length, currentTab;
        for( ; j < t; j++ ) {
            currentTab = currentWindow.tabs[j];
            // Skip chrome:// and https:// pages
            if( (currentTab.url != null ) && ! currentTab.url.match(/(chrome):\/\//gi) ) {
                injectIntoTab(currentTab);
                console.log("Reloaded tab: " + currentTab.url);
            }
        }
    }
});