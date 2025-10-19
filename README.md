# Live HTML/Tailwind Code Editor

A single-page application that provides a split-screen interface with a code editor on one side and a real-time preview on the other. Users can write HTML with Tailwind CSS classes and see instant results.

## Features

### Core Functionality
- **Split-screen layout**: Editor and preview panels side by side
- **Real-time preview**: Updates as you type (with 300ms debouncing)
- **Tailwind CSS integration**: Uses Tailwind Play CDN for instant styling
- **Syntax-friendly editor**: Monospace font with proper indentation support

### User Actions
- **Clear**: Reset the editor and preview
- **Copy Code**: Copy HTML code to clipboard
- **Download**: Save code as complete HTML file
- **Refresh Preview**: Manually refresh the preview
- **Fullscreen Preview**: View preview in fullscreen mode

### Editor Features
- **Tab support**: Press Tab for 2-space indentation
- **Line counter**: Shows current line count
- **Auto-save**: Code persists during session
- **Placeholder text**: Helpful guidance for new users

### Responsive Design
- **Desktop**: Side-by-side panels with resizable divider
- **Mobile**: Stacked panels (editor on top, preview below)
- **Touch support**: Resizer works on touch devices

## Technical Implementation

### HTML Structure
- Semantic HTML5 elements
- Accessible markup with proper ARIA labels
- Responsive meta tags

### CSS Features
- CSS Grid and Flexbox for layout
- CSS custom properties for theming
- Smooth animations and transitions
- Custom scrollbar styling
- Mobile-first responsive design

### JavaScript Features
- ES6+ class-based architecture
- Debounced preview updates for performance
- Tailwind CDN injection via iframe srcdoc
- Clipboard API with fallback support
- Fullscreen API implementation
- Touch event handling for mobile resizer

## Browser Compatibility

### Required Features
- ES6+ support (class syntax, arrow functions, etc.)
- iframe srcdoc support
- CSS Grid and Flexbox
- Clipboard API (with execCommand fallback)
- Fullscreen API

### Tested Browsers
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Usage

1. Open `index.html` in a modern web browser
2. Write HTML code in the left editor panel
3. Use Tailwind CSS classes for styling
4. See real-time preview in the right panel
5. Use controls to clear, copy, download, or fullscreen

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

## File Structure

```
Live HTMLTailwind Code Editor/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Performance Considerations

### Debouncing
- 300ms delay prevents excessive iframe updates
- Reduces CPU usage during rapid typing
- Provides smooth typing experience

### Memory Management
- Iframe content is properly cleaned up
- Event listeners are properly managed
- No memory leaks detected in testing

### Optimization Features
- Lightweight DOM manipulation
- Efficient CSS selectors
- Minimal JavaScript overhead
- Optimized for mobile performance

## Security Considerations

- Uses iframe srcdoc for isolated preview environment
- No external dependencies except Tailwind CDN
- No server-side processing required
- Safe for local file system usage

## Future Enhancements

### Potential Features
- Multiple tabs for different code snippets
- Syntax highlighting for HTML
- Code templates and examples
- Dark/light theme toggle
- Export to different formats
- Code validation and error highlighting
- Integrated console for JavaScript debugging

### Performance Improvements
- Web Workers for syntax highlighting
- Virtual scrolling for large files
- Local storage for code persistence
- Code minification for production

## License

This project is open source and available under the MIT License.