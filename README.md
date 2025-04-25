# Show Transcript

A Chrome extension that automatically displays transcripts on YouTube videos and allows copying without timestamps.

## Features

- **Auto-Display Transcript**: Automatically shows the transcript for YouTube videos without needing to click the transcript button
- **Copy Functionality**: Easily copy the entire transcript to clipboard without timestamps
- **Minimal Permissions**: Only uses the `clipboardWrite` permission to enable the copy feature
- **Native Look**: Styled to match YouTube's design, including dark mode support

## Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store (link will be added once published)
2. Click "Add to Chrome"

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension folder
5. The extension should now be installed and active

## Usage

1. Navigate to any YouTube video
2. The transcript will automatically appear below the video description
3. Click on any timestamp to jump to that point in the video
4. Click the "Copy" button to copy the full transcript without timestamps

## Creating Icons

This repository includes an HTML file (`icons/create_icons.html`) that will help you generate the required icons. Open this file in a browser, then right-click on each canvas and save the images as `icon16.png`, `icon48.png`, and `icon128.png` in the `icons` folder.

## Publishing to Chrome Web Store

Before publishing:
1. Create the extension icons using the provided HTML tool
2. Test the extension thoroughly on various YouTube videos
3. Compress the folder into a ZIP file
4. Submit to the Chrome Web Store Developer Dashboard

## Development

- `manifest.json`: Extension configuration
- `content.js`: Main extension logic
- `styles.css`: Styling for the transcript display

## License

MIT