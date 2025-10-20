// Live HTML/Tailwind Code Editor - Enhanced with VSCode-style features
class LiveEditor {
    constructor() {
        this.editorElement = document.getElementById('codeEditor');
        this.previewFrame = document.getElementById('previewFrame');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.findReplaceBtn = document.getElementById('findReplaceBtn');
        this.lineCountElement = document.getElementById('lineCount');
        this.charCountElement = document.getElementById('charCount');
        this.lineNumbersElement = document.getElementById('lineNumbers');
        this.previewLoading = document.getElementById('previewLoading');
        this.resizerElement = document.getElementById('resizer');
        this.previewContainer = document.querySelector('.preview-container');

        this.currentCode = '';
        this.updateTimeout = null;
        this.syntaxHighlightTimeout = null;
        this.isResizing = false;
        this.isDarkTheme = true;
        this.lastSaveTime = Date.now();
        this.currentLine = 1;
        this.currentColumn = 1;

        // Initialize enhanced features
        this.initializeEnhancedFeatures();

        this.initializeEventListeners();
        this.loadSavedCode();
        this.updatePreview();
        this.updateLineNumbers();
        this.initializeTheme();
    }

    initializeEnhancedFeatures() {
        // Syntax highlighter removed - focusing on core functionality

        // Initialize current line highlighting
        this.initializeCurrentLineHighlight();

        // Initialize find and replace widget
        this.findReplaceWidget = new FindReplaceWidget(this);

        // Initialize device preview system
        this.devicePreview = new DevicePreview(this.previewFrame, this.previewContainer);

        // Initialize autocomplete system (using textarea directly)
        this.autocompleteSystem = new AutocompleteSystem(this.editorElement, this.editorElement);

        // Initialize error detection system (without syntax highlighter)
        this.errorDetectionSystem = new ErrorDetectionSystem(this.editorElement);

        // Initialize enhanced selection tracking
        this.initializeSelectionTracking();
    }

    initializeCurrentLineHighlight() {
        // Create current line highlight element
        this.currentLineHighlight = document.createElement('div');
        this.currentLineHighlight.className = 'current-line-highlight';
        this.currentLineHighlight.style.display = 'none';

        // Insert into editor wrapper
        const editorWrapper = document.querySelector('.editor-wrapper');
        editorWrapper.insertBefore(this.currentLineHighlight, this.editorElement);

        // Update on cursor movement
        this.editorElement.addEventListener('click', () => this.updateCurrentLineHighlight());
        this.editorElement.addEventListener('keyup', () => this.updateCurrentLineHighlight());
        this.editorElement.addEventListener('input', () => this.updateCurrentLineHighlight());
    }

    initializeSelectionTracking() {
        // Track selection changes for enhanced visual feedback
        this.editorElement.addEventListener('selectionchange', () => {
            this.updateCurrentLineHighlight();
        });

        // Enhanced selection styling
        this.editorElement.addEventListener('select', () => {
            this.highlightSelection();
        });
    }

    updateCurrentLineHighlight() {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            const cursorPos = this.editorElement.selectionStart;
            const textBeforeCursor = this.editorElement.value.substring(0, cursorPos);
            const lines = textBeforeCursor.split('\n');
            this.currentLine = lines.length;
            this.currentColumn = lines[lines.length - 1].length + 1;

            // Position the highlight
            const lineHeight = 21; // Match CSS line-height
            const top = (this.currentLine - 1) * lineHeight;
            const scrollTop = this.editorElement.scrollTop;

            // Use transform for better performance
            const translateY = top - scrollTop;
            this.currentLineHighlight.style.transform = `translateY(${translateY}px)`;
            this.currentLineHighlight.style.display = 'block';

            // Update line numbers current line
            this.updateLineNumbersCurrentLine();
        });
    }

    updateLineNumbersCurrentLine() {
        // Update line numbers to highlight current line
        const lineNumbers = this.lineNumbersElement.innerHTML.split('<br>');
        const updatedNumbers = lineNumbers.map((lineNum, index) => {
            const lineNumValue = index + 1;
            const isCurrentLine = lineNumValue === this.currentLine;
            return isCurrentLine ?
                `<span class="current-line">${lineNumValue}</span>` :
                lineNumValue;
        });
        this.lineNumbersElement.innerHTML = updatedNumbers.join('<br>');
    }

    highlightSelection() {
        // Enhanced selection highlighting (integrated with syntax highlighter)
        // This would add additional visual feedback for selected text
        // The syntax highlighter already handles basic selection styling
    }

    initializeEventListeners() {
        // Editor events
        this.editorElement.addEventListener('input', () => this.handleEditorInput());
        this.editorElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.editorElement.addEventListener('scroll', () => this.syncLineNumbers());
        this.editorElement.addEventListener('focus', () => this.handleEditorFocus());
        this.editorElement.addEventListener('blur', () => this.handleEditorBlur());

        // Button events
        this.clearBtn.addEventListener('click', () => this.clearEditor());
        this.copyBtn.addEventListener('click', () => this.copyCode());
        this.downloadBtn.addEventListener('click', () => this.downloadCode());
        this.refreshBtn.addEventListener('click', () => this.updatePreview());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.findReplaceBtn.addEventListener('click', () => this.findReplaceWidget.show('find'));

        // Resizer events
        this.initializeResizer();

        // Window resize event
        window.addEventListener('resize', () => this.handleWindowResize());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Auto-save
        setInterval(() => this.autoSave(), 30000); // Auto-save every 30 seconds
    }

    handleEditorInput() {
        this.currentCode = this.editorElement.value;
        this.updateLineCount();
        this.updateCharCount();
        this.updateLineNumbers();
        this.debouncedUpdatePreview();
        this.updateStatusBar();

        // Update enhanced features with performance optimization
        this.updateCurrentLineHighlight();

        // Debounced syntax highlighting to prevent performance issues
        this.debouncedSyntaxHighlight();
    }

    handleKeyDown(e) {
        // Handle tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.editorElement.selectionStart;
            const end = this.editorElement.selectionEnd;

            this.editorElement.value = this.currentCode.substring(0, start) + '  ' + this.currentCode.substring(end);
            this.editorElement.selectionStart = this.editorElement.selectionEnd = start + 2;

            this.currentCode = this.editorElement.value;
            this.updateLineCount();
            this.debouncedUpdatePreview();
        }
    }

    debouncedUpdatePreview() {
        // Clear existing timeout
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // Set new timeout for debouncing
        this.updateTimeout = setTimeout(() => {
            this.updatePreview();
        }, 300); // 300ms debounce delay
    }

    debouncedSyntaxHighlight() {
        // Clear existing timeout
        if (this.syntaxHighlightTimeout) {
            clearTimeout(this.syntaxHighlightTimeout);
        }

        // Adaptive debouncing based on content length for better performance
        const contentLength = this.editorElement.value.length;
        let debounceDelay = 50; // Default delay

        if (contentLength > 5000) {
            debounceDelay = 100; // Longer delay for large content
        } else if (contentLength < 500) {
            debounceDelay = 25; // Shorter delay for small content
        }

        // Set new timeout for debouncing syntax highlighting
        this.syntaxHighlightTimeout = setTimeout(() => {
            try {
                // Syntax highlighter removed
            } catch (error) {
                console.error('Error in preview update:', error);
                // No syntax highlighter fallback needed
            }
        }, debounceDelay);
    }

    updatePreview() {
        // Show loading state
        this.showLoadingState();

        // Small delay to show loading animation
        setTimeout(() => {
            if (!this.currentCode.trim()) {
                this.previewFrame.srcdoc = this.createEmptyPage();
                this.hideLoadingState();
                return;
            }

            const fullHTML = this.createFullHTML(this.currentCode);
            this.previewFrame.srcdoc = fullHTML;

            // Hide loading after iframe loads
            this.previewFrame.onload = () => {
                this.hideLoadingState();
            };
        }, 300);
    }

    showLoadingState() {
        this.previewLoading.classList.add('active');
    }

    hideLoadingState() {
        this.previewLoading.classList.remove('active');
    }

    createFullHTML(userCode) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
    </style>
</head>
<body>
    ${userCode}
</body>
</html>`;
    }

    createEmptyPage() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            color: #6b7280;
        }
        .empty-state {
            text-align: center;
        }
        .empty-state svg {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Start writing HTML code with Tailwind CSS classes to see the preview here.</p>
    </div>
</body>
</html>`;
    }

    clearEditor() {
        if (this.currentCode.trim() && !confirm('Are you sure you want to clear all code?')) {
            return;
        }

        this.editorElement.value = '';
        this.currentCode = '';
        this.updateLineCount();
        this.updatePreview();
        this.editorElement.focus();
    }

    async copyCode() {
        try {
            await navigator.clipboard.writeText(this.currentCode);
            this.showNotification('Code copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            this.editorElement.select();
            document.execCommand('copy');
            this.showNotification('Code copied to clipboard!', 'success');
        }
    }

    downloadCode() {
        if (!this.currentCode.trim()) {
            this.showNotification('No code to download!', 'error');
            return;
        }

        const fullHTML = this.createFullHTML(this.currentCode);
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `tailwind-preview-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('File downloaded successfully!', 'success');
    }

    toggleFullscreen() {
        const previewContainer = document.querySelector('.preview-container');

        if (!document.fullscreenElement) {
            previewContainer.requestFullscreen().then(() => {
                this.fullscreenBtn.textContent = 'Exit Fullscreen';
                this.showNotification('Entered fullscreen mode', 'info');
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                this.fullscreenBtn.textContent = 'Fullscreen';
                this.showNotification('Exited fullscreen mode', 'info');
            }).catch(err => {
                console.error('Error attempting to exit fullscreen:', err);
            });
        }
    }

    initializeResizer() {
        let startX = 0;
        let startWidth = 0;
        let startWidthRight = 0;

        const initResize = (e) => {
            this.isResizing = true;
            startX = e.clientX;

            const editorPanel = document.querySelector('.editor-panel');
            const previewPanel = document.querySelector('.preview-panel');

            startWidth = editorPanel.offsetWidth;
            startWidthRight = previewPanel.offsetWidth;

            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        };

        const doResize = (e) => {
            if (!this.isResizing) return;

            const deltaX = e.clientX - startX;
            const editorPanel = document.querySelector('.editor-panel');
            const previewPanel = document.querySelector('.preview-panel');
            const containerWidth = document.querySelector('.main-content').offsetWidth;

            const newEditorWidth = ((startWidth + deltaX) / containerWidth) * 100;
            const newPreviewWidth = ((startWidthRight - deltaX) / containerWidth) * 100;

            // Set minimum widths (25% each)
            if (newEditorWidth >= 25 && newPreviewWidth >= 25) {
                editorPanel.style.flex = `0 0 ${newEditorWidth}%`;
                previewPanel.style.flex = `0 0 ${newPreviewWidth}%`;
            }
        };

        const stopResize = () => {
            this.isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        this.resizerElement.addEventListener('mousedown', initResize);
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);

        // Touch events for mobile
        this.resizerElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            initResize({ clientX: touch.clientX });
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isResizing) return;
            const touch = e.touches[0];
            doResize({ clientX: touch.clientX });
        });

        document.addEventListener('touchend', stopResize);
    }

    handleWindowResize() {
        // Reset flex properties on window resize for responsive behavior
        const editorPanel = document.querySelector('.editor-panel');
        const previewPanel = document.querySelector('.preview-panel');

        if (window.innerWidth <= 768) {
            editorPanel.style.flex = '';
            previewPanel.style.flex = '';
        }
    }

    updateLineCount() {
        const lines = this.currentCode.split('\n').length;
        this.lineCountElement.textContent = `Lines: ${lines}`;
    }

    showNotification(message, type = 'info', duration = 4000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => {
            if (n.parentNode) {
                n.parentNode.removeChild(n);
            }
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Create icon based on type
        let iconSvg = '';
        switch (type) {
            case 'success':
                iconSvg = '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                break;
            case 'error':
                iconSvg = '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                break;
            default:
                iconSvg = '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        }

        notification.innerHTML = `
            ${iconSvg}
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }

    // Enhanced methods for new features
    refreshAllFeatures() {
        // Syntax highlighter removed
        if (this.devicePreview) {
            this.devicePreview.refresh();
        }
        if (this.autocompleteSystem) {
            this.autocompleteSystem.refresh();
        }
        if (this.errorDetectionSystem) {
            this.errorDetectionSystem.refresh();
        }
        this.updateCurrentLineHighlight();
        this.updateStatusBar();
    }

    // Cleanup method for proper resource management
    destroy() {
        // Clear all timeouts
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        if (this.syntaxHighlightTimeout) {
            clearTimeout(this.syntaxHighlightTimeout);
        }

        // Destroy enhanced features
        // Syntax highlighter removed
        if (this.autocompleteSystem) {
            this.autocompleteSystem.destroy();
        }
        if (this.errorDetectionSystem) {
            this.errorDetectionSystem.destroy();
        }
        if (this.devicePreview) {
            this.devicePreview.destroy();
        }

        // Remove event listeners
        this.editorElement.removeEventListener('input', this.handleEditorInput);
        this.editorElement.removeEventListener('keydown', this.handleKeyDown);
        this.editorElement.removeEventListener('scroll', this.syncLineNumbers);
        this.editorElement.removeEventListener('focus', this.handleEditorFocus);
        this.editorElement.removeEventListener('blur', this.handleEditorBlur);

        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        window.removeEventListener('resize', this.handleWindowResize);
    }

    // Get current state for debugging or analytics
    getEditorState() {
        return {
            currentCode: this.currentCode,
            currentLine: this.currentLine,
            currentColumn: this.currentColumn,
            isDarkTheme: this.isDarkTheme,
            lineCount: this.currentCode.split('\n').length,
            charCount: this.currentCode.length,
            errors: this.errorDetectionSystem ? this.errorDetectionSystem.getErrors() : [],
            warnings: this.errorDetectionSystem ? this.errorDetectionSystem.getWarnings() : [],
            deviceInfo: this.devicePreview ? this.devicePreview.getCurrentDimensions() : null
        };
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }

    updateLineNumbers() {
        const lines = this.currentCode.split('\n');
        const lineNumbersHtml = lines.map((_, index) => index + 1).join('<br>');
        this.lineNumbersElement.innerHTML = lineNumbersHtml;
    }

    syncLineNumbers() {
        this.lineNumbersElement.scrollTop = this.editorElement.scrollTop;
        // Syntax highlighter removed
    }

    updateCharCount() {
        const charCount = this.currentCode.length;
        this.charCountElement.textContent = `${charCount} chars`;
    }

    updateStatusBar() {
        const statusInfo = document.getElementById('statusInfo');
        const lastSaved = document.getElementById('lastSaved');

        // Get enhanced status information
        const lines = this.currentCode.split('\n').length;
        const chars = this.currentCode.length;
        const words = this.currentCode.trim() ? this.currentCode.trim().split(/\s+/).length : 0;

        // Check for syntax errors
        const hasErrors = this.errorDetectionSystem ? this.errorDetectionSystem.getErrors().length > 0 : false;
        const hasWarnings = this.errorDetectionSystem ? this.errorDetectionSystem.getWarnings().length > 0 : false;

        let statusText = 'HTML + Tailwind CSS';

        if (this.currentCode.trim()) {
            statusText += ' • Editing';

            if (hasErrors || hasWarnings) {
                const errorCount = this.errorDetectionSystem.getErrors().length;
                const warningCount = this.errorDetectionSystem.getWarnings().length;
                statusText += ` • ${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${warningCount !== 1 ? 's' : ''}`;
            }
        } else {
            statusText += ' • Ready';
        }

        // Add cursor position
        statusText += ` • Line ${this.currentLine}, Column ${this.currentColumn}`;

        statusInfo.textContent = statusText;

        // Enhanced last saved info
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSaved.textContent = `Saved at ${timeString}`;
    }

    handleEditorFocus() {
        this.lineNumbersElement.style.background = 'var(--bg-editor)';
    }

    handleEditorBlur() {
        this.lineNumbersElement.style.background = 'var(--bg-primary)';
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.isDarkTheme = false;
            this.applyLightTheme();
        }
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;

        if (this.isDarkTheme) {
            this.applyDarkTheme();
            localStorage.setItem('theme', 'dark');
        } else {
            this.applyLightTheme();
            localStorage.setItem('theme', 'light');
        }

        this.updateThemeIcon();
        this.showNotification(
            `Switched to ${this.isDarkTheme ? 'dark' : 'light'} theme`,
            'info',
            2000
        );
    }

    applyDarkTheme() {
        document.documentElement.style.setProperty('--bg-primary', '#0a0a0f');
        document.documentElement.style.setProperty('--bg-secondary', '#1a1a23');
        document.documentElement.style.setProperty('--bg-tertiary', '#2a2a35');
        document.documentElement.style.setProperty('--bg-editor', '#161622');
        document.documentElement.style.setProperty('--text-primary', '#f8f8ff');
        document.documentElement.style.setProperty('--text-secondary', '#b8b8c8');
        document.documentElement.style.setProperty('--text-muted', '#6b6b80');

        document.getElementById('themeStatus').textContent = 'Dark Theme';

        // Update theme toggle icon
        const themeIcon = this.themeToggle.querySelector('svg');
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    }

    applyLightTheme() {
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
        document.documentElement.style.setProperty('--bg-tertiary', '#f1f5f9');
        document.documentElement.style.setProperty('--bg-editor', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#1e293b');
        document.documentElement.style.setProperty('--text-secondary', '#475569');
        document.documentElement.style.setProperty('--text-muted', '#94a3b8');

        document.getElementById('themeStatus').textContent = 'Light Theme';

        // Update theme toggle icon
        const themeIcon = this.themeToggle.querySelector('svg');
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }

    updateThemeIcon() {
        const themeStatus = document.getElementById('themeStatus');
        themeStatus.textContent = this.isDarkTheme ? 'Dark Theme' : 'Light Theme';
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: Save/Download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.downloadCode();
        }

        // Ctrl/Cmd + Shift + C: Copy Code
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.copyCode();
        }

        // Ctrl/Cmd + /: Toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.toggleTheme();
        }

        // Ctrl/Cmd + R: Refresh preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.updatePreview();
        }

        // Ctrl/Cmd + Shift + D: Toggle device selector
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            this.toggleDeviceSelector();
        }

        // Ctrl/Cmd + Shift + E: Toggle error panel
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            this.toggleErrorPanel();
        }

        // Ctrl/Cmd + Shift + H: Toggle syntax highlighting
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            this.toggleSyntaxHighlighting();
        }

        // Ctrl/Cmd + I: Go to line
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            this.showGoToLineDialog();
        }
    }

    toggleDeviceSelector() {
        const deviceSelector = document.querySelector('.device-selector');
        if (deviceSelector) {
            deviceSelector.classList.toggle('collapsed');
            this.showNotification(
                deviceSelector.classList.contains('collapsed') ?
                'Device selector hidden' : 'Device selector shown',
                'info',
                2000
            );
        }
    }

    toggleErrorPanel() {
        const errorPanel = document.querySelector('.error-panel');
        if (errorPanel) {
            errorPanel.classList.toggle('collapsed');
            this.showNotification(
                errorPanel.classList.contains('collapsed') ?
                'Error panel hidden' : 'Error panel shown',
                'info',
                2000
            );
        }
    }

    toggleSyntaxHighlighting() {
        const container = document.querySelector('.syntax-highlight-container');
        if (container) {
            const isVisible = container.style.display !== 'none';
            container.style.display = isVisible ? 'none' : 'block';
            this.showNotification(
                isVisible ? 'Syntax highlighting disabled' : 'Syntax highlighting enabled',
                'info',
                2000
            );
        }
    }

    showGoToLineDialog() {
        const totalLines = this.currentCode.split('\n').length;
        const lineNumber = prompt(`Go to line (1-${totalLines}):`, this.currentLine);

        if (lineNumber && !isNaN(lineNumber)) {
            const targetLine = Math.max(1, Math.min(totalLines, parseInt(lineNumber)));
            this.goToLine(targetLine);
        }
    }

    goToLine(lineNumber) {
        const lines = this.currentCode.split('\n');
        let cursorPosition = 0;

        for (let i = 0; i < lineNumber - 1; i++) {
            cursorPosition += lines[i].length + 1; // +1 for newline
        }

        this.editorElement.focus();
        this.editorElement.setSelectionRange(cursorPosition, cursorPosition);
        this.editorElement.scrollTop = (lineNumber - 1) * 21; // Approximate line height
        this.updateCurrentLineHighlight();

        this.showNotification(`Moved to line ${lineNumber}`, 'info', 2000);
    }

    autoSave() {
        // Save to localStorage
        localStorage.setItem('editorCode', this.currentCode);
        localStorage.setItem('lastSaveTime', Date.now().toString());

        const lastSaved = document.getElementById('lastSaved');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSaved.textContent = `Saved at ${timeString}`;

        // Show subtle save indicator
        this.showNotification('Code auto-saved', 'info', 2000);
    }

    loadSavedCode() {
        const savedCode = localStorage.getItem('editorCode');
        if (savedCode && savedCode.trim()) {
            this.editorElement.value = savedCode;
            this.currentCode = savedCode;
            this.updateLineCount();
            this.updateCharCount();
            this.updateLineNumbers();
            this.updatePreview();

            // Trigger syntax highlighting for loaded content
            setTimeout(() => {
                // Syntax highlighter removed
            }, 50);

            this.showNotification('Previous session restored', 'info', 3000);
        } else {
            this.loadDefaultCode();
        }
    }

    loadDefaultCode() {
        const defaultCode = `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
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
</div>`;

        this.editorElement.value = defaultCode;
        this.currentCode = defaultCode;
        this.updateLineCount();

        // Syntax highlighter removed
    }
}

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liveEditor = new LiveEditor();
});

// Export LiveEditor class globally for debugging and future use
window.LiveEditor = LiveEditor;

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.fullscreenElement) {
        fullscreenBtn.textContent = 'Fullscreen';
    }
});