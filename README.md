# **Two-digit Tab Switcher**
A chrome extension that allows switching to 2-digit tabs

----------
##**Description**
Have you ever tried tab switching using <kbd>cmd+[1-9]</kbd>? Ever wished <kbd>cmd+9</kbd> would take you to the 9th tab instead of the last one? Well then, welcome to the Two-digit Tab Switcher!

###Usage
Using this extension, you can not only switch to the 9th tab using <kbd>cmd+9</kbd> but also easily switch to tab 18 by pressing <kbd>cmd+1,8</kbd>. <kbd>cmd+0</kbd> takes you to the last tab.

----------
##**Known issues**
> - *If I try to use <kbd>Cmd+1,2</kbd>, I first land up on Tab 1 and then on Tab 12.*

This happens because the extension listens to keydown and keyup events and acts upon them. Default Chrome bindings have not been overridden. The author hasn't verified whether doing so is possible.

> - *<kbd>Cmd+0</kbd> resets my eariler tab's page zoom to 100%*

This happens for the same reason as the above issue.

> - *I disabled and re-enabled the extension. It is behaving weirdly.*

As of now, reloading issues haven't been completely fixed. Removing the previous event listeners on reloading is a pending task that will be taken up on priority.
