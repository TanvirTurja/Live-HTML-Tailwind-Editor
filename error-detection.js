// Error Detection and Visual Highlighting System
class ErrorDetectionSystem {
    constructor(editorElement, syntaxHighlighter) {
        this.editorElement = editorElement;
        this.syntaxHighlighter = syntaxHighlighter;
        this.errors = [];
        this.warnings = [];

        // Error panel
        this.errorPanel = null;
        this.createErrorPanel();

        // Initialize validation
        this.initializeValidation();
    }

    createErrorPanel() {
        this.errorPanel = document.createElement('div');
        this.errorPanel.className = 'error-panel';
        this.errorPanel.innerHTML = `
            <div class="error-panel-header">
                <h3>Code Validation</h3>
                <button class="error-panel-toggle" title="Toggle error panel">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                </button>
            </div>
            <div class="error-list">
                <div class="error-summary">
                    <div class="error-count">
                        <span class="error-icon">❌</span>
                        <span class="error-text">0 Errors</span>
                    </div>
                    <div class="warning-count">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-text">0 Warnings</span>
                    </div>
                </div>
                <div class="error-items"></div>
            </div>
        `;

        // Insert error panel after editor container
        const editorContainer = document.querySelector('.editor-container');
        editorContainer.appendChild(this.errorPanel);

        // Add toggle functionality
        const toggle = this.errorPanel.querySelector('.error-panel-toggle');
        toggle.addEventListener('click', () => {
            this.errorPanel.classList.toggle('collapsed');
        });
    }

    initializeValidation() {
        // Validate on input changes
        this.editorElement.addEventListener('input', () => {
            this.debounceValidation();
        });
    }

    debounceValidation() {
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
            this.validateCode();
        }, 500);
    }

    validateCode() {
        const code = this.editorElement.value;
        this.errors = [];
        this.warnings = [];

        if (!code.trim()) {
            this.updateErrorPanel();
            return;
        }

        // Parse HTML and detect errors
        this.parseAndValidateHTML(code);

        // Check for common issues
        this.checkCommonIssues(code);

        // Check Tailwind classes
        this.validateTailwindClasses(code);

        // Update error panel
        this.updateErrorPanel();

        // Update syntax highlighting with error indicators
        this.updateSyntaxHighlighting();
    }

    parseAndValidateHTML(code) {
        // Remove comments for validation
        const codeWithoutComments = code.replace(/<!--[\s\S]*?-->/g, '');

        // Find all HTML tags
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
        const tags = [];
        let match;

        while ((match = tagRegex.exec(codeWithoutComments)) !== null) {
            const fullTag = match[0];
            const tagName = match[1];
            const isClosingTag = fullTag.startsWith('</');
            const isSelfClosing = fullTag.endsWith('/>');
            const position = this.getLineAndColumn(code, match.index);

            tags.push({
                name: tagName.toLowerCase(),
                fullTag: fullTag,
                isClosing: isClosingTag,
                isSelfClosing: isSelfClosing,
                position: position,
                index: match.index
            });
        }

        // Validate tag structure
        this.validateTagStructure(tags);

        // Validate attributes
        this.validateAttributes(tags, code);
    }

    validateTagStructure(tags) {
        const openTags = [];
        const selfClosingTags = new Set([
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        ]);

        tags.forEach(tag => {
            if (tag.isClosing) {
                // Check for matching opening tag
                const matchingIndex = openTags.findIndex(openTag =>
                    openTag.name === tag.name
                );

                if (matchingIndex === -1) {
                    this.errors.push({
                        type: 'error',
                        message: `Unexpected closing tag </${tag.name}> without matching opening tag`,
                        position: tag.position,
                        severity: 'error'
                    });
                } else {
                    // Check for properly nested tags
                    const openTagsAfter = openTags.slice(matchingIndex + 1);
                    if (openTagsAfter.length > 0) {
                        const unclosedTag = openTagsAfter[openTagsAfter.length - 1];
                        this.errors.push({
                            type: 'error',
                            message: `Unclosed tag <${unclosedTag.name}>. Expected </${unclosedTag.name}> before </${tag.name}>`,
                            position: tag.position,
                            severity: 'error'
                        });
                    }
                    openTags.splice(matchingIndex, 1);
                }
            } else if (!tag.isSelfClosing && !selfClosingTags.has(tag.name)) {
                openTags.push(tag);
            }
        });

        // Check for unclosed tags
        openTags.forEach(tag => {
            this.errors.push({
                type: 'error',
                message: `Unclosed tag <${tag.name}>`,
                position: tag.position,
                severity: 'error'
            });
        });
    }

    validateAttributes(tags, code) {
        tags.forEach(tag => {
            if (tag.isClosing) return;

            const attrRegex = /(\s+)([a-zA-Z][a-zA-Z0-9-_]*)(=)(["'])(.*?)\4/g;
            let attrMatch;

            while ((attrMatch = attrRegex.exec(tag.fullTag)) !== null) {
                const attrName = attrMatch[2];
                const attrValue = attrMatch[5];
                const attrPosition = this.getLineAndColumn(code, tag.index + attrMatch.index + 1);

                // Validate class attributes
                if (attrName === 'class') {
                    this.validateClassAttribute(attrValue, attrPosition);
                }

                // Validate href attributes
                if (attrName === 'href') {
                    this.validateHrefAttribute(attrValue, attrPosition);
                }

                // Validate src attributes
                if (attrName === 'src') {
                    this.validateSrcAttribute(attrValue, attrPosition);
                }

                // Validate alt attributes for images
                if (tag.name === 'img' && attrName === 'alt') {
                    if (!attrValue.trim()) {
                        this.warnings.push({
                            type: 'warning',
                            message: 'Image missing alt text for accessibility',
                            position: attrPosition,
                            severity: 'warning'
                        });
                    }
                }
            }

            // Check for missing required attributes
            this.checkRequiredAttributes(tag);
        });
    }

    validateClassAttribute(classValue, position) {
        const classes = classValue.split(/\s+/);

        classes.forEach(cls => {
            cls = cls.trim();
            if (!cls) return;

            // Check for invalid class names
            if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(cls) && !this.isValidTailwindClass(cls)) {
                this.warnings.push({
                    type: 'warning',
                    message: `Potentially invalid class name: "${cls}"`,
                    position: position,
                    severity: 'warning'
                });
            }
        });
    }

    validateHrefAttribute(hrefValue, position) {
        if (hrefValue.trim() === '#') {
            this.warnings.push({
                type: 'warning',
                message: 'Empty href="#" may cause accessibility issues',
                position: position,
                severity: 'warning'
            });
        }
    }

    validateSrcAttribute(srcValue, position) {
        if (srcValue.trim() === '') {
            this.errors.push({
                type: 'error',
                message: 'Empty src attribute',
                position: position,
                severity: 'error'
            });
        }
    }

    checkRequiredAttributes(tag) {
        const requiredAttrs = {
            'img': ['src', 'alt'],
            'a': ['href'],
            'link': ['href', 'rel'],
            'script': ['src'],
            'style': [],
            'meta': []
        };

        if (requiredAttrs[tag.name]) {
            const attrRegex = /(\s+)([a-zA-Z][a-zA-Z0-9-_]*)(=)/g;
            const foundAttrs = [];
            let match;

            while ((match = attrRegex.exec(tag.fullTag)) !== null) {
                foundAttrs.push(match[2]);
            }

            requiredAttrs[tag.name].forEach(requiredAttr => {
                if (!foundAttrs.includes(requiredAttr)) {
                    const severity = tag.name === 'img' && requiredAttr === 'alt' ? 'warning' : 'error';
                    const list = this[severity + 's'];
                    list.push({
                        type: severity,
                        message: `Missing required attribute "${requiredAttr}" for <${tag.name}> tag`,
                        position: tag.position,
                        severity: severity
                    });
                }
            });
        }
    }

    checkCommonIssues(code) {
        // Check for malformed HTML comments
        const commentRegex = /<!--(?!.*?-->)/g;
        let commentMatch;

        while ((commentMatch = commentRegex.exec(code)) !== null) {
            const position = this.getLineAndColumn(code, commentMatch.index);
            this.errors.push({
                type: 'error',
                message: 'Unclosed HTML comment',
                position: position,
                severity: 'error'
            });
        }

        // Check for unescaped ampersands
        const ampersandRegex = /&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;|#x[0-9a-fA-F]+;)/g;
        let ampMatch;

        while ((ampMatch = ampersandRegex.exec(code)) !== null) {
            const position = this.getLineAndColumn(code, ampMatch.index);
            this.warnings.push({
                type: 'warning',
                message: 'Unescaped ampersand (&). Use &amp; instead',
                position: position,
                severity: 'warning'
            });
        }

        // Check for deprecated attributes
        const deprecatedAttrs = ['border', 'align', 'bgcolor', 'cellpadding', 'cellspacing'];
        deprecatedAttrs.forEach(attr => {
            const regex = new RegExp(`\\s${attr}=`, 'g');
            if (regex.test(code)) {
                this.warnings.push({
                    type: 'warning',
                    message: `Deprecated attribute "${attr}" found. Consider using CSS instead`,
                    position: { line: 1, column: 1 },
                    severity: 'warning'
                });
            }
        });
    }

    validateTailwindClasses(code) {
        // Extract all class attributes
        const classAttrRegex = /class=["']([^"']*)["']/g;
        let match;

        while ((match = classAttrRegex.exec(code)) !== null) {
            const classValue = match[1];
            const position = this.getLineAndColumn(code, match.index);
            const classes = classValue.split(/\s+/);

            classes.forEach(cls => {
                cls = cls.trim();
                if (!cls) return;

                // Check for common Tailwind syntax errors
                if (this.hasTailwindSyntaxError(cls)) {
                    this.warnings.push({
                        type: 'warning',
                        message: `Possible Tailwind syntax error in class: "${cls}"`,
                        position: position,
                        severity: 'warning'
                    });
                }
            });
        }
    }

    hasTailwindSyntaxError(className) {
        // Check for common syntax errors
        const invalidPatterns = [
            /^[a-z]-[^a-z]/, // Single letter prefix followed by dash and non-letter
            /[^a-z0-9-_]/, // Invalid characters
            /[a-z]-[A-Z]/, // Lowercase letter dash uppercase letter
            /\d-[a-z]/, // Number followed by dash and letter (should be reversed)
        ];

        // Skip variants (hover:, focus:, etc.) and responsive prefixes (sm:, md:, etc.)
        const hasVariant = /^(hover|focus|active|disabled|group-hover|group-focus|sm|md|lg|xl|2xl):/.test(className);

        return !hasVariant && invalidPatterns.some(pattern => pattern.test(className));
    }

    isValidTailwindClass(className) {
        // Check if it's a variant
        if (/^(hover|focus|active|disabled|group-hover|group-focus|sm|md|lg|xl|2xl):/.test(className)) {
            return true;
        }

        // Check for common Tailwind patterns
        const tailwindPatterns = [
            /^(block|inline|flex|grid|hidden|contents|list-item|table|table-row|table-cell)$/,
            /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-[0-9]+$/,
            /^(w|h|min-w|min-h|max-w|max-h)-[0-9a-z-]+$/,
            /^bg-[a-z]+-[0-9]{2,3}$/,
            /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
            /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
            /^(rounded|border|shadow|opacity)-[a-z0-9-]*$/,
            /^transition-(all|colors|opacity|shadow|transform)$/,
            /^(scale|rotate|translate)-[a-z0-9-]*$/,
            /^(gap|space-[xy])-[0-9]+$/,
            /^(grid-cols|grid-rows)-[0-9]+$/
        ];

        return tailwindPatterns.some(pattern => pattern.test(className));
    }

    getLineAndColumn(code, index) {
        const textBeforeIndex = code.substring(0, index);
        const lines = textBeforeIndex.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        return { line, column };
    }

    updateErrorPanel() {
        const errorCount = this.errorPanel.querySelector('.error-text');
        const warningCount = this.errorPanel.querySelector('.warning-text');
        const errorItems = this.errorPanel.querySelector('.error-items');

        errorCount.textContent = `${this.errors.length} Error${this.errors.length !== 1 ? 's' : ''}`;
        warningCount.textContent = `${this.warnings.length} Warning${this.warnings.length !== 1 ? 's' : ''}`;

        // Clear existing items
        errorItems.innerHTML = '';

        // Combine errors and warnings, sort by position
        const allIssues = [...this.errors, ...this.warnings].sort((a, b) => {
            if (a.position.line !== b.position.line) {
                return a.position.line - b.position.line;
            }
            return a.position.column - b.position.column;
        });

        if (allIssues.length === 0) {
            errorItems.innerHTML = '<div class="no-issues">✅ No issues found</div>';
            return;
        }

        allIssues.forEach(issue => {
            const item = document.createElement('div');
            item.className = `error-item ${issue.severity}`;
            item.innerHTML = `
                <div class="error-item-header">
                    <span class="error-item-icon">${issue.severity === 'error' ? '❌' : '⚠️'}</span>
                    <span class="error-item-position">Line ${issue.position.line}, Column ${issue.position.column}</span>
                </div>
                <div class="error-item-message">${issue.message}</div>
            `;

            item.addEventListener('click', () => {
                this.goToPosition(issue.position);
            });

            errorItems.appendChild(item);
        });
    }

    updateSyntaxHighlighting() {
        // This would integrate with the syntax highlighter to show errors
        // For now, we'll update the error panel
        this.highlightErrorsInEditor();
    }

    highlightErrorsInEditor() {
        // Add error highlighting to the editor
        // This is a simplified version - in a real implementation,
        // you'd want to integrate this with the syntax highlighter
        const lines = this.editorElement.value.split('\n');

        this.errors.forEach(error => {
            const lineIndex = error.position.line - 1;
            if (lineIndex >= 0 && lineIndex < lines.length) {
                // Add error indicator (this would be integrated with syntax highlighter)
                // For now, we'll just update the error panel
            }
        });
    }

    goToPosition(position) {
        const lines = this.editorElement.value.split('\n');
        let cursorPosition = 0;

        for (let i = 0; i < position.line - 1; i++) {
            cursorPosition += lines[i].length + 1; // +1 for newline
        }

        cursorPosition += position.column - 1;

        this.editorElement.focus();
        this.editorElement.setSelectionRange(cursorPosition, cursorPosition);
        this.editorElement.scrollTop = (position.line - 1) * 21; // Approximate line height
    }

    // Public methods
    refresh() {
        this.validateCode();
    }

    getErrors() {
        return this.errors;
    }

    getWarnings() {
        return this.warnings;
    }

    hasIssues() {
        return this.errors.length > 0 || this.warnings.length > 0;
    }

    destroy() {
        if (this.errorPanel && this.errorPanel.parentNode) {
            this.errorPanel.parentNode.removeChild(this.errorPanel);
        }
        clearTimeout(this.validationTimeout);
    }
}

// Export for use in main script
window.ErrorDetectionSystem = ErrorDetectionSystem;