# Live HTML/Tailwind Code Editor

A feature-rich, single-page application that provides a professional split-screen interface with a code editor on one side and a real-time preview on the other. Users can write HTML with Tailwind CSS classes and see instant results with advanced features like device preview, autocomplete, and error detection.

## Features

### Core Functionality
- **Split-screen layout**: Editor and preview panels side by side with resizable divider
- **Real-time preview**: Updates as you type (with 300ms debouncing)
- **Tailwind CSS integration**: Uses Tailwind Play CDN for instant styling
- **Professional code editor**: Monospace font with line numbers and current line highlighting
- **Dark/Light theme toggle**: Switch between themes with persistence

### Advanced Features
- **Device Preview**: Test your code on different device sizes (Desktop, Tablet, Mobile)
- **Tailwind Autocomplete**: Intelligent class suggestions with icons and variants
- **Error Detection**: Real-time HTML validation with error highlighting
- **Auto-save**: Code persists during session with automatic saving every 30 seconds
- **Session Restoration**: Automatically restores your previous session

### User Actions
- **Clear**: Reset the editor and preview
- **Copy Code**: Copy HTML code to clipboard
- **Download**: Save code as complete HTML file
- **Refresh Preview**: Manually refresh the preview
- **Fullscreen Preview**: View preview in fullscreen mode

### Editor Features
- **Tab support**: Press Tab for 2-space indentation
- **Line counter**: Shows current line count with real-time updates
- **Character counter**: Displays total character count
- **Status bar**: Shows current position, save status, and theme
- **Go to line**: Navigate to specific line numbers
- **Current line highlighting**: Visual indicator for active line

### Responsive Design
- **Desktop**: Side-by-side panels with resizable divider
- **Mobile**: Stacked panels (editor on top, preview below)
- **Touch support**: Resizer works on touch devices

## Project Structure

The project consists of two main pages:

1. **Landing Page** ([`index.html`](index.html)): A beautiful introduction page with features overview and launch button
2. **Editor Page** ([`editor.html`](editor.html)): The main code editor interface

```
Live HTMLTailwind Code Editor/
├── index.html             # Landing page with feature overview
├── editor.html            # Main editor interface
├── styles.css             # Complete CSS styling with glassmorphism design
├── script.js              # Core editor functionality
├── device-preview.js      # Device preview system
├── autocomplete.js        # Tailwind class autocomplete
├── error-detection.js     # HTML validation and error highlighting
├── BEAUTY_ENHANCEMENTS.md # Visual design documentation
└── README.md              # This documentation
```

## Usage

### Getting Started
1. Open [`index.html`](index.html) in a modern web browser to view the landing page
2. Click "Launch Editor" to open the main editor interface
3. Write HTML code in the left editor panel
4. Use Tailwind CSS classes for styling
5. See real-time preview in the right panel
6. Use controls to clear, copy, download, or fullscreen

### Using Advanced Features

#### Device Preview
1. In the preview panel, use the device selector dropdown
2. Choose between Desktop, Tablet, or Mobile views
3. The preview will adjust to the selected device dimensions

#### Autocomplete
1. Start typing in a `class="..."` attribute
2. Suggestions will appear automatically as you type
3. Use arrow keys to navigate suggestions
4. Press Enter or Tab to select a suggestion
5. Press Escape to close the suggestions

#### Error Detection
1. The error panel appears below the editor
2. It shows HTML validation errors and warnings
3. Click on any error to jump to that line in the editor
4. Toggle the panel visibility using the collapse button

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Insert 2-space indentation |
| `Ctrl/Cmd + S` | Save/Download code |
| `Ctrl/Cmd + Shift + C` | Copy code to clipboard |
| `Ctrl/Cmd + /` | Toggle dark/light theme |
| `Ctrl/Cmd + R` | Refresh preview |
| `Ctrl/Cmd + Shift + D` | Toggle device selector |
| `Ctrl/Cmd + Shift + E` | Toggle error panel |
| `Ctrl/Cmd + I` | Go to line dialog |

## Technical Implementation

### HTML Structure
- Semantic HTML5 elements
- Accessible markup with proper ARIA labels
- Responsive meta tags
- Modern font loading with Google Fonts (Inter and JetBrains Mono)

### CSS Features
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **CSS Custom Properties**: Complete design system for easy theming
- **CSS Grid and Flexbox**: Modern layout techniques
- **Smooth Animations**: Hardware-accelerated transitions
- **Custom Scrollbar Styling**: Consistent design throughout
- **Mobile-first Responsive Design**: Adapts to all screen sizes

### JavaScript Features
- **ES6+ Class-based Architecture**: Modern JavaScript patterns
- **Modular Design**: Separate modules for different features
- **Debounced Updates**: Performance optimization for preview and validation
- **Tailwind CDN Injection**: Via iframe srcdoc for isolated preview
- **Clipboard API**: With fallback support for older browsers
- **Fullscreen API**: For immersive preview experience
- **Touch Event Handling**: Mobile resizer functionality
- **Local Storage**: For theme persistence and auto-save

### Error Detection System
- **HTML Validation**: Real-time parsing and validation
- **Tag Structure Checking**: Validates proper nesting and closing
- **Attribute Validation**: Checks required attributes and values
- **Tailwind Class Validation**: Identifies potential syntax errors
- **Accessibility Warnings**: Highlights missing alt text and other issues

### Autocomplete System
- **Comprehensive Tailwind Database**: Includes all utility classes
- **Variant Support**: Hover, focus, responsive prefixes
- **Smart Filtering**: Relevance-based sorting
- **Icon Indicators**: Visual cues for different class types
- **Performance Optimized**: Efficient matching algorithms

## Browser Compatibility

### Required Features
- ES6+ support (class syntax, arrow functions, etc.)
- iframe srcdoc support
- CSS Grid and Flexbox
- Clipboard API (with execCommand fallback)
- Fullscreen API
- Local Storage API

### Tested Browsers
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Example Code

The editor comes pre-loaded with a sample Tailwind component:

```html
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <img class="h-48 w-full object-cover md:h-full md:w-48"
           src="https://images.unsplash.com/photo-1515711660811-d483d6af2536?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
           alt="Modern building">
    </div>
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
        Finding customers for your new business
      </a>
      <p class="mt-2 text-slate-500">
        Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.
      </p>
      <div class="mt-4">
        <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </div>
</div>
```

## Performance Considerations

### Debouncing
- 300ms delay prevents excessive iframe updates
- Adaptive debouncing for syntax highlighting (25-100ms based on content size)
- Reduces CPU usage during rapid typing

### Memory Management
- Iframe content is properly cleaned up
- Event listeners are properly managed
- No memory leaks detected in testing
- Cleanup methods implemented for all modules

### Optimization Features
- Lightweight DOM manipulation
- Efficient CSS selectors
- Hardware-accelerated animations
- Optimized for mobile performance
- RequestAnimationFrame for smooth updates

## Security Considerations

- Uses iframe srcdoc for isolated preview environment
- No external dependencies except Tailwind CDN
- No server-side processing required
- Safe for local file system usage
- Input sanitization in error detection

## Troubleshooting

### Common Issues

**Preview not updating**
- Try clicking the Refresh button in the preview panel
- Check browser console for errors
- Ensure JavaScript is enabled

**Autocomplete not working**
- Make sure you're typing inside a `class="..."` attribute
- Check that the class attribute is properly quoted
- Try refreshing the page

**Error detection showing false positives**
- The error detection is conservative and may flag some valid patterns
- Focus on errors rather than warnings for critical issues
- Use your judgment for advanced Tailwind patterns

**Performance issues on large files**
- The editor is optimized for files up to ~10,000 lines
- For larger files, consider splitting into multiple components
- Use the auto-save feature to prevent data loss

**Mobile responsiveness issues**
- Ensure you're using the mobile version (stacked layout)
- Try rotating your device for better screen utilization
- Use touch gestures carefully on the resizer

### Getting Help

If you encounter issues not covered here:
1. Check the browser console for error messages
2. Try refreshing the page to reset the editor state
3. Clear browser cache and localStorage if needed
4. Ensure you're using a supported browser version

## Future Enhancements

### Potential Features
- Multiple tabs for different code snippets
- Syntax highlighting for HTML
- Code templates and examples gallery
- Export to different formats (PDF, PNG)
- Integrated console for JavaScript debugging
- Collaborative editing features
- Version history and undo/redo functionality

### Performance Improvements
- Web Workers for syntax highlighting
- Virtual scrolling for large files
- Cloud storage integration
- Code minification for production
- Incremental preview updates

## Contributing

This project is open source and available under the MIT License. Contributions are welcome, especially for:
- New device presets for device preview
- Additional Tailwind class autocomplete patterns
- Enhanced error detection rules
- UI/UX improvements
- Performance optimizations

## License

This project is open source and available under the MIT License.