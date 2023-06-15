All code that can only run within the "content" context.

* Content scripts have access to the DOM and can make changes to it.
* The JavaScript runs in isolation, meaning it won't interfere with JavaScript running on the page, and vice versa.
* However, it shares the same view of the DOM as the page's scripts.