# MyLMS Timetable Plus

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](/LICENSE.md)
[![PRS: welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](/CONTRIBUTING.md)
[![Browser Extension: TypeScript](https://img.shields.io/badge/Browser%20Extension-TypeScript-blue)](/CONTRIBUTING.md)

### Supercharge your My LMS Timetable.

## Overview

**MyLMS Timetable Plus** is a browser extension that enhances the default MyLMS timetable by providing a more intuitive look and feel. It's written in TypeScript.

![Demo or Screenshot 1](/screenshots/mylms+.PNG)

## Features

* Generates a new timetable

## Development

This project uses TypeScript. Make sure to install the dependencies first:

```sh
npm install
```

To compile the TypeScript code, run:

```sh
npm run build
```

This will compile the TypeScript code into JavaScript, which will be used by the Chrome Extension into the `dist` directory.

## Testing

1. build the extension using `npm run build`
2. Navigate to [chrome://extensions](chrome://extensions) in your Chrome browser.
3. Toggle the "Developer mode" switch in the top-right corner.
4. Click "Load unpacked" and select the `dist` directory.

Alternatively, you can download the extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/mylms-timetable-plus/dhchofhmkachcdamglpaobnbjmnmdkmp?hl=en-US).
For Firefox users, you can use the [extension](https://addons.mozilla.org/en-US/firefox/addon/mylms-timetable-plus/)
## Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details.
