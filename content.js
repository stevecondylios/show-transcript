// Wait for YouTube to fully load
document.addEventListener('yt-navigate-finish', function() {
  // Give YouTube a moment to settle
  setTimeout(showTranscript, 2000);
});

// Initial page load
if (document.readyState === 'complete') {
  setTimeout(showTranscript, 2000);
} else {
  window.addEventListener('load', function() {
    setTimeout(showTranscript, 2000);
  });
}

function showTranscript() {
  // Only proceed if we're on a watch page
  if (!window.location.pathname.includes('/watch')) return;
  
  // Check if transcript container already exists
  if (document.querySelector('.show-transcript-container')) return;
  
  console.log('Show Transcript extension: Looking for transcript button');
  
  // Direct method: Find the transcript button directly
  const directTranscriptButton = document.querySelector('#primary-button button');
  if (directTranscriptButton) {
    console.log('Show Transcript extension: Found primary button');
    // Create our own transcript container
    createTranscriptContainer();
    
    // Click the transcript button directly
    directTranscriptButton.click();
    
    // Wait for transcript to load then capture it
    setTimeout(captureTranscript, 1000);
    return;
  }
  
  // Fallback method: Try the "More actions" approach
  console.log('Show Transcript extension: Trying fallback method');
  const moreActionsButton = document.querySelector('ytd-menu-renderer button[aria-label="More actions"]');
  if (!moreActionsButton) {
    console.log('Show Transcript extension: Could not find any transcript button');
    return;
  }
  
  // Click the button to open the menu
  moreActionsButton.click();
  
  // Wait for menu to appear and find the Transcript option
  setTimeout(() => {
    const menuItems = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer'));
    const transcriptMenuItem = menuItems.find(item => {
      const text = item.textContent.trim();
      return text.includes('Transcript') || text.includes('transcript');
    });
    
    // Close the menu by clicking outside
    document.body.click();
    
    if (!transcriptMenuItem) {
      console.log('Show Transcript extension: Could not find transcript option in menu');
      return;
    }
    
    // Create our own transcript container
    createTranscriptContainer();
    
    // Click the transcript menu item to open YouTube's transcript panel
    setTimeout(() => {
      transcriptMenuItem.click();
      
      // Wait for transcript to load then capture it
      setTimeout(captureTranscript, 1000);
    }, 300);
  }, 300);
}

function createTranscriptContainer() {
  // Create container for our transcript
  const container = document.createElement('div');
  container.className = 'show-transcript-container';
  
  // Create header with title and copy button
  const header = document.createElement('div');
  header.className = 'transcript-header';
  
  const title = document.createElement('h2');
  title.textContent = 'Transcript';
  
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.className = 'copy-transcript-button';
  copyButton.addEventListener('click', copyTranscriptToClipboard);
  
  header.appendChild(title);
  header.appendChild(copyButton);
  
  // Create content area
  const content = document.createElement('div');
  content.className = 'transcript-content';
  
  // Add to container
  container.appendChild(header);
  container.appendChild(content);
  
  // Add to page - insert before the comments section
  const commentsSection = document.querySelector('#comments');
  if (commentsSection && commentsSection.parentNode) {
    commentsSection.parentNode.insertBefore(container, commentsSection);
  } else {
    // Fallback: add to primary info
    const primaryInfo = document.querySelector('#primary-inner');
    if (primaryInfo) {
      primaryInfo.appendChild(container);
    }
  }
}

function captureTranscript() {
  // Find YouTube's transcript panel
  const ytTranscriptPanel = document.querySelector('ytd-transcript-search-panel-renderer');
  if (!ytTranscriptPanel) return;
  
  // Get all transcript segments
  const segments = Array.from(ytTranscriptPanel.querySelectorAll('ytd-transcript-segment-renderer'));
  if (!segments.length) return;
  
  // Our transcript container content area
  const transcriptContent = document.querySelector('.transcript-content');
  if (!transcriptContent) return;
  
  // Clear any existing content
  transcriptContent.innerHTML = '';
  
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Process each segment
  segments.forEach(segment => {
    const timeElement = segment.querySelector('.segment-timestamp');
    const textElement = segment.querySelector('.segment-text');
    
    if (timeElement && textElement) {
      const time = timeElement.textContent.trim();
      const text = textElement.textContent.trim();
      
      const segmentDiv = document.createElement('div');
      segmentDiv.className = 'transcript-segment';
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'transcript-time';
      timeDiv.textContent = time;
      timeDiv.addEventListener('click', () => {
        // Extract time in seconds and seek video
        const timeParts = time.split(':').map(Number);
        let seconds = 0;
        if (timeParts.length === 3) { // HH:MM:SS
          seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        } else if (timeParts.length === 2) { // MM:SS
          seconds = timeParts[0] * 60 + timeParts[1];
        }
        
        const video = document.querySelector('video');
        if (video) video.currentTime = seconds;
      });
      
      const textDiv = document.createElement('div');
      textDiv.className = 'transcript-text';
      textDiv.textContent = text;
      
      segmentDiv.appendChild(timeDiv);
      segmentDiv.appendChild(textDiv);
      
      fragment.appendChild(segmentDiv);
    }
  });
  
  // Add all segments to our container
  transcriptContent.appendChild(fragment);
  
  // Close YouTube's transcript panel
  const closeButton = ytTranscriptPanel.querySelector('ytd-button-renderer[aria-label="Close"]');
  if (closeButton) {
    closeButton.querySelector('button').click();
  }
}

function copyTranscriptToClipboard() {
  const segments = document.querySelectorAll('.transcript-segment .transcript-text');
  if (!segments.length) return;
  
  // Combine all transcript text without timestamps
  const fullText = Array.from(segments).map(segment => segment.textContent.trim()).join('\n');
  
  // Copy to clipboard
  navigator.clipboard.writeText(fullText).then(() => {
    const copyButton = document.querySelector('.copy-transcript-button');
    if (copyButton) {
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      
      // Reset button text after 2 seconds
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy transcript: ', err);
  });
}