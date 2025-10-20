/**
 * Find and Replace Widget - VSCode-style search and replace functionality
 * Integrates seamlessly with the Live HTML/Tailwind Code Editor
 */
class FindReplaceWidget {
    constructor(editorInstance) {
        this.editor = editorInstance;
        this.editorElement = editorInstance.editorElement;
        this.isVisible = false;
        this.currentMatchIndex = -1;
        this.matches = [];
        this.searchTerm = '';
        this.replaceTerm = '';
        this.caseSensitive = false;
        this.wholeWord = false;
        this.useRegex = false;

        this.createElements();
        this.bindEvents();
        this.initializeKeyboardShortcuts();
    }

    createElements() {
        // Create widget container
        this.widgetContainer = document.createElement('div');
        this.widgetContainer.className = 'find-replace-widget';
        this.widgetContainer.innerHTML = `
            <div class="find-replace-content">
                <!-- Search Bar -->
                <div class="search-row">
                    <div class="input-wrapper">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" class="search-input" placeholder="Find" spellcheck="false">
                    </div>
                    <div class="match-counter">
                        <span class="match-text">No results</span>
                    </div>
                    <div class="search-controls">
                        <button class="control-btn toggle-replace-btn" title="Toggle Replace">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                        <button class="control-btn case-sensitive-btn" title="Match Case">
                            <span class="btn-text">Aa</span>
                        </button>
                        <button class="control-btn whole-word-btn" title="Match Whole Word">
                            <span class="btn-text">A..b</span>
                        </button>
                        <button class="control-btn regex-btn" title="Use Regular Expression">
                            <span class="btn-text">.*</span>
                        </button>
                    </div>
                </div>

                <!-- Replace Bar -->
                <div class="replace-row">
                    <div class="input-wrapper">
                        <svg class="replace-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <input type="text" class="replace-input" placeholder="Replace" spellcheck="false">
                    </div>
                    <div class="replace-controls">
                        <button class="btn btn-secondary replace-btn" title="Replace">
                            Replace
                        </button>
                        <button class="btn btn-secondary replace-all-btn" title="Replace All">
                            Replace All
                        </button>
                    </div>
                </div>

                <!-- Navigation Controls -->
                <div class="navigation-row">
                    <div class="nav-controls">
                        <button class="btn btn-nav prev-btn" title="Previous Match">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button class="btn btn-nav next-btn" title="Next Match">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <button class="close-btn" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.querySelector('.editor-panel').appendChild(this.widgetContainer);

        // Cache element references
        this.searchInput = this.widgetContainer.querySelector('.search-input');
        this.replaceInput = this.widgetContainer.querySelector('.replace-input');
        this.matchCounter = this.widgetContainer.querySelector('.match-text');
        this.toggleReplaceBtn = this.widgetContainer.querySelector('.toggle-replace-btn');
        this.caseSensitiveBtn = this.widgetContainer.querySelector('.case-sensitive-btn');
        this.wholeWordBtn = this.widgetContainer.querySelector('.whole-word-btn');
        this.regexBtn = this.widgetContainer.querySelector('.regex-btn');
        this.prevBtn = this.widgetContainer.querySelector('.prev-btn');
        this.nextBtn = this.widgetContainer.querySelector('.next-btn');
        this.replaceBtn = this.widgetContainer.querySelector('.replace-btn');
        this.replaceAllBtn = this.widgetContainer.querySelector('.replace-all-btn');
        this.closeBtn = this.widgetContainer.querySelector('.close-btn');
    }

    bindEvents() {
        // Search input events
        this.searchInput.addEventListener('input', () => this.handleSearchInput());
        this.searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));

        // Replace input events
        this.replaceInput.addEventListener('keydown', (e) => this.handleReplaceKeydown(e));

        // Control buttons
        this.toggleReplaceBtn.addEventListener('click', () => this.toggleReplaceMode());
        this.caseSensitiveBtn.addEventListener('click', () => this.toggleCaseSensitive());
        this.wholeWordBtn.addEventListener('click', () => this.toggleWholeWord());
        this.regexBtn.addEventListener('click', () => this.toggleRegex());

        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.navigateToPreviousMatch());
        this.nextBtn.addEventListener('click', () => this.navigateToNextMatch());

        // Replace buttons
        this.replaceBtn.addEventListener('click', () => this.replaceCurrentMatch());
        this.replaceAllBtn.addEventListener('click', () => this.replaceAllMatches());

        // Close button
        this.closeBtn.addEventListener('click', () => this.hide());

        // Prevent clicks inside widget from closing it
        this.widgetContainer.addEventListener('click', (e) => e.stopPropagation());
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+F - Open find
            if (e.ctrlKey && e.key === 'f' && !e.shiftKey) {
                e.preventDefault();
                this.show('find');
            }

            // Ctrl+H - Open replace
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.show('replace');
            }

            // Escape - Close widget
            if (e.key === 'Escape' && this.isVisible) {
                e.preventDefault();
                this.hide();
            }
        });
    }

    show(mode = 'find') {
        this.isVisible = true;
        this.widgetContainer.classList.add('visible');

        // Focus search input
        this.searchInput.focus();

        // If there's selected text, use it as search term
        const selectedText = this.getSelectedText();
        if (selectedText && !this.searchInput.value) {
            this.searchInput.value = selectedText;
            this.searchTerm = selectedText;
            this.handleSearchInput();
        }

        // Show replace row if in replace mode
        if (mode === 'replace') {
            this.widgetContainer.classList.add('replace-mode');
            this.toggleReplaceBtn.classList.add('active');
            setTimeout(() => this.replaceInput.focus(), 100);
        } else {
            this.widgetContainer.classList.remove('replace-mode');
            this.toggleReplaceBtn.classList.remove('active');
        }
    }

    hide() {
        this.isVisible = false;
        this.widgetContainer.classList.remove('visible');
        this.clearHighlights();
        this.editorElement.focus();
    }

    getSelectedText() {
        return this.editorElement.value.substring(
            this.editorElement.selectionStart,
            this.editorElement.selectionEnd
        );
    }

    handleSearchInput() {
        this.searchTerm = this.searchInput.value;
        this.findMatches();
        this.updateMatchCounter();
        this.highlightMatches();

        if (this.matches.length > 0) {
            this.currentMatchIndex = 0;
            this.navigateToMatch(0);
        }
    }

    handleSearchKeydown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (e.shiftKey) {
                    this.navigateToPreviousMatch();
                } else {
                    this.navigateToNextMatch();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateToPreviousMatch();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateToNextMatch();
                break;
        }
    }

    handleReplaceKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.replaceCurrentMatch();
        }
    }

    findMatches() {
        this.matches = [];
        if (!this.searchTerm) return;

        const text = this.editorElement.value;
        const regex = this.createSearchRegex();
        let match;

        while ((match = regex.exec(text)) !== null) {
            this.matches.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
            });
        }
    }

    createSearchRegex() {
        let pattern = this.searchTerm;
        let flags = this.caseSensitive ? 'g' : 'gi';

        if (this.useRegex) {
            try {
                return new RegExp(pattern, flags);
            } catch (e) {
                // Invalid regex, fall back to literal search
                this.useRegex = false;
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
        } else {
            // Escape special regex characters for literal search
            pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        if (this.wholeWord) {
            pattern = `\\b${pattern}\\b`;
        }

        return new RegExp(pattern, flags);
    }

    updateMatchCounter() {
        if (this.matches.length === 0) {
            this.matchCounter.textContent = 'No results';
            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;
        } else {
            this.matchCounter.textContent = `${this.currentMatchIndex + 1} of ${this.matches.length}`;
            this.prevBtn.disabled = false;
            this.nextBtn.disabled = false;
        }
    }

    highlightMatches() {
        this.clearHighlights();

        if (this.matches.length === 0) return;

        // Create overlay for highlights
        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.className = 'highlight-overlay';

        const editorRect = this.editorElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this.editorElement);

        // Copy positioning and font properties
        Object.assign(this.highlightOverlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: this.editorElement.offsetWidth + 'px',
            height: this.editorElement.offsetHeight + 'px',
            pointerEvents: 'none',
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            lineHeight: computedStyle.lineHeight,
            paddingLeft: computedStyle.paddingLeft,
            paddingTop: computedStyle.paddingTop,
            zIndex: '1'
        });

        this.matches.forEach((match, index) => {
            const highlight = document.createElement('div');
            highlight.className = 'search-highlight';
            if (index === this.currentMatchIndex) {
                highlight.classList.add('current-match');
            }

            const position = this.getMatchPosition(match);
            Object.assign(highlight.style, {
                position: 'absolute',
                left: position.left + 'px',
                top: position.top + 'px',
                width: position.width + 'px',
                height: position.height + 'px'
            });

            this.highlightOverlay.appendChild(highlight);
        });

        // Insert overlay after editor element
        this.editorElement.parentNode.appendChild(this.highlightOverlay);
    }

    getMatchPosition(match) {
        const textBefore = this.editorElement.value.substring(0, match.start);
        const lines = textBefore.split('\n');
        const currentLine = lines.length - 1;
        const currentColumn = lines[lines.length - 1].length;

        const computedStyle = window.getComputedStyle(this.editorElement);
        const lineHeight = parseInt(computedStyle.lineHeight);
        const charWidth = this.getAverageCharacterWidth();

        return {
            left: parseInt(computedStyle.paddingLeft) + (currentColumn * charWidth),
            top: parseInt(computedStyle.paddingTop) + (currentLine * lineHeight),
            width: (match.end - match.start) * charWidth,
            height: lineHeight
        };
    }

    getAverageCharacterWidth() {
        // Create a temporary element to measure character width
        const temp = document.createElement('span');
        const computedStyle = window.getComputedStyle(this.editorElement);

        // Copy relevant styles
        temp.style.cssText = `
            position: absolute;
            visibility: hidden;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            font-weight: ${computedStyle.fontWeight};
            letter-spacing: ${computedStyle.letterSpacing};
            white-space: pre;
        `;

        temp.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        document.body.appendChild(temp);

        const width = temp.offsetWidth / 62; // Average over 62 characters

        document.body.removeChild(temp);
        return width || 8; // Fallback to 8px if calculation fails
    }

    clearHighlights() {
        if (this.highlightOverlay) {
            this.highlightOverlay.remove();
            this.highlightOverlay = null;
        }
    }

    navigateToNextMatch() {
        if (this.matches.length === 0) return;

        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
        this.navigateToMatch(this.currentMatchIndex);
    }

    navigateToPreviousMatch() {
        if (this.matches.length === 0) return;

        this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
        this.navigateToMatch(this.currentMatchIndex);
    }

    navigateToMatch(index) {
        if (this.matches.length === 0 || index < 0 || index >= this.matches.length) return;

        this.currentMatchIndex = index;
        const match = this.matches[index];

        // Set cursor selection
        this.editorElement.focus();
        this.editorElement.setSelectionRange(match.start, match.end);

        // Update highlights
        this.highlightMatches();
        this.updateMatchCounter();

        // Scroll into view if needed
        this.scrollMatchIntoView(match);
    }

    scrollMatchIntoView(match) {
        const textBefore = this.editorElement.value.substring(0, match.start);
        const lines = textBefore.split('\n');
        const lineNumber = lines.length;

        const lineHeight = parseInt(window.getComputedStyle(this.editorElement).lineHeight);
        const editorHeight = this.editorElement.clientHeight;
        const scrollTop = this.editorElement.scrollTop;

        const matchTop = (lineNumber - 1) * lineHeight;
        const matchBottom = matchTop + lineHeight;

        if (matchTop < scrollTop) {
            this.editorElement.scrollTop = matchTop;
        } else if (matchBottom > scrollTop + editorHeight) {
            this.editorElement.scrollTop = matchBottom - editorHeight;
        }
    }

    replaceCurrentMatch() {
        if (this.matches.length === 0 || this.currentMatchIndex < 0) return;

        const match = this.matches[this.currentMatchIndex];
        const text = this.editorElement.value;

        // Replace the text
        const newText = text.substring(0, match.start) +
                       this.replaceInput.value +
                       text.substring(match.end);

        this.editorElement.value = newText;
        this.editorElement.focus();

        // Trigger editor input event to update other systems
        this.editor.handleEditorInput();

        // Re-find matches
        this.handleSearchInput();
    }

    replaceAllMatches() {
        if (this.matches.length === 0) return;

        const text = this.editorElement.value;
        const regex = this.createSearchRegex();
        const newText = text.replace(regex, this.replaceInput.value);

        this.editorElement.value = newText;
        this.editorElement.focus();

        // Trigger editor input event
        this.editor.handleEditorInput();

        // Clear search
        this.matches = [];
        this.updateMatchCounter();
        this.clearHighlights();

        // Show success notification
        this.editor.showNotification(`Replaced ${this.matches.length} occurrences`, 'success');
    }

    toggleCaseSensitive() {
        this.caseSensitive = !this.caseSensitive;
        this.caseSensitiveBtn.classList.toggle('active');
        this.handleSearchInput();
    }

    toggleWholeWord() {
        this.wholeWord = !this.wholeWord;
        this.wholeWordBtn.classList.toggle('active');
        this.handleSearchInput();
    }

    toggleRegex() {
        this.useRegex = !this.useRegex;
        this.regexBtn.classList.toggle('active');
        this.handleSearchInput();
    }

    toggleReplaceMode() {
        const isReplaceMode = this.widgetContainer.classList.contains('replace-mode');

        if (isReplaceMode) {
            // Switch to Find mode
            this.widgetContainer.classList.remove('replace-mode');
            this.toggleReplaceBtn.classList.remove('active');
            // Focus back to search input
            this.searchInput.focus();
        } else {
            // Switch to Replace mode
            this.widgetContainer.classList.add('replace-mode');
            this.toggleReplaceBtn.classList.add('active');
            // Focus to replace input
            setTimeout(() => this.replaceInput.focus(), 100);
        }
    }

    destroy() {
        this.clearHighlights();
        this.widgetContainer.remove();
        // Remove event listeners if needed
    }
}