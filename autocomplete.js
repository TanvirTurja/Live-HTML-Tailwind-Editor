// Tailwind Class Autocomplete System
class AutocompleteSystem {
    constructor(editorElement, highlightElement) {
        this.editorElement = editorElement;
        this.highlightElement = highlightElement;
        this.suggestions = [];
        this.currentIndex = -1;
        this.isVisible = false;
        this.currentContext = null;

        // Autocomplete dropdown
        this.dropdown = null;
        this.createAutocompleteDropdown();

        // Tailwind class database
        this.tailwindClasses = this.getTailwindClasses();

        // Initialize event listeners
        this.initializeEvents();
    }

    getTailwindClasses() {
        return {
            // Layout
            display: [
                'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid',
                'hidden', 'contents', 'list-item', 'table', 'table-row', 'table-cell'
            ],

            // Flexbox
            flexDirection: [
                'flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'
            ],
            flexWrap: [
                'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'
            ],
            justifyContent: [
                'justify-start', 'justify-end', 'justify-center', 'justify-between',
                'justify-around', 'justify-evenly', 'justify-stretch'
            ],
            alignItems: [
                'items-start', 'items-end', 'items-center', 'items-baseline',
                'items-stretch'
            ],
            alignSelf: [
                'auto', 'start', 'end', 'center', 'baseline', 'stretch'
            ],
            flex: [
                'flex-1', 'flex-auto', 'flex-initial', 'flex-none'
            ],
            flexGrow: [
                'flex-grow-0', 'flex-grow', 'flex-grow-1'
            ],
            flexShrink: [
                'flex-shrink-0', 'flex-shrink', 'flex-shrink-1'
            ],
            gap: [
                'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6',
                'gap-8', 'gap-10', 'gap-12', 'gap-16', 'gap-20', 'gap-24',
                'gap-x-0', 'gap-x-1', 'gap-x-2', 'gap-x-3', 'gap-x-4', 'gap-x-5',
                'gap-x-6', 'gap-x-8', 'gap-x-10', 'gap-x-12', 'gap-x-16',
                'gap-x-20', 'gap-x-24',
                'gap-y-0', 'gap-y-1', 'gap-y-2', 'gap-y-3', 'gap-y-4', 'gap-y-5',
                'gap-y-6', 'gap-y-8', 'gap-y-10', 'gap-y-12', 'gap-y-16',
                'gap-y-20', 'gap-y-24'
            ],

            // Grid
            gridTemplateColumns: [
                'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
                'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8',
                'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12',
                'grid-cols-none'
            ],
            gridTemplateRows: [
                'grid-rows-1', 'grid-rows-2', 'grid-rows-3', 'grid-rows-4',
                'grid-rows-5', 'grid-rows-6', 'grid-rows-none'
            ],

            // Spacing
            padding: [
                'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8',
                'p-10', 'p-12', 'p-16', 'p-20', 'p-24', 'p-28', 'p-32',
                'p-36', 'p-40', 'p-44', 'p-48', 'p-52', 'p-56', 'p-60',
                'p-64', 'p-72', 'p-80', 'p-96',
                'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6',
                'px-8', 'px-10', 'px-12', 'px-16', 'px-20', 'px-24',
                'px-28', 'px-32', 'px-36', 'px-40', 'px-44', 'px-48',
                'px-52', 'px-56', 'px-60', 'px-64', 'px-72', 'px-80',
                'px-96',
                'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6',
                'py-8', 'py-10', 'py-12', 'py-16', 'py-20', 'py-24',
                'py-28', 'py-32', 'py-36', 'py-40', 'py-44', 'py-48',
                'py-52', 'py-56', 'py-60', 'py-64', 'py-72', 'py-80',
                'py-96',
                'pt-0', 'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6',
                'pt-8', 'pt-10', 'pt-12', 'pt-16', 'pt-20', 'pt-24',
                'pt-28', 'pt-32', 'pt-36', 'pt-40', 'pt-44', 'pt-48',
                'pt-52', 'pt-56', 'pt-60', 'pt-64', 'pt-72', 'pt-80',
                'pt-96',
                'pr-0', 'pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5', 'pr-6',
                'pr-8', 'pr-10', 'pr-12', 'pr-16', 'pr-20', 'pr-24',
                'pr-28', 'pr-32', 'pr-36', 'pr-40', 'pr-44', 'pr-48',
                'pr-52', 'pr-56', 'pr-60', 'pr-64', 'pr-72', 'pr-80',
                'pr-96',
                'pb-0', 'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6',
                'pb-8', 'pb-10', 'pb-12', 'pb-16', 'pb-20', 'pb-24',
                'pb-28', 'pb-32', 'pb-36', 'pb-40', 'pb-44', 'pb-48',
                'pb-52', 'pb-56', 'pb-60', 'pb-64', 'pb-72', 'pb-80',
                'pb-96',
                'pl-0', 'pl-1', 'pl-2', 'pl-3', 'pl-4', 'pl-5', 'pl-6',
                'pl-8', 'pl-10', 'pl-12', 'pl-16', 'pl-20', 'pl-24',
                'pl-28', 'pl-32', 'pl-36', 'pl-40', 'pl-44', 'pl-48',
                'pl-52', 'pl-56', 'pl-60', 'pl-64', 'pl-72', 'pl-80',
                'pl-96'
            ],
            margin: [
                'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8',
                'm-10', 'm-12', 'm-16', 'm-20', 'm-24', 'm-28', 'm-32',
                'm-36', 'm-40', 'm-44', 'm-48', 'm-52', 'm-56', 'm-60',
                'm-64', 'm-72', 'm-80', 'm-96', 'm-auto',
                'm-px', 'mx-0', 'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5',
                'mx-6', 'mx-8', 'mx-10', 'mx-12', 'mx-16', 'mx-20',
                'mx-24', 'mx-28', 'mx-32', 'mx-36', 'mx-40', 'mx-44',
                'mx-48', 'mx-52', 'mx-56', 'mx-60', 'mx-64', 'mx-72',
                'mx-80', 'mx-96', 'mx-auto',
                'my-0', 'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-6',
                'my-8', 'my-10', 'my-12', 'my-16', 'my-20', 'my-24',
                'my-28', 'my-32', 'my-36', 'my-40', 'my-44', 'my-48',
                'my-52', 'my-56', 'my-60', 'my-64', 'my-72', 'my-80',
                'my-96', 'my-auto',
                'mt-0', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6',
                'mt-8', 'mt-10', 'mt-12', 'mt-16', 'mt-20', 'mt-24',
                'mt-28', 'mt-32', 'mt-36', 'mt-40', 'mt-44', 'mt-48',
                'mt-52', 'mt-56', 'mt-60', 'mt-64', 'mt-72', 'mt-80',
                'mt-96', 'mt-auto',
                'mr-0', 'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6',
                'mr-8', 'mr-10', 'mr-12', 'mr-16', 'mr-20', 'mr-24',
                'mr-28', 'mr-32', 'mr-36', 'mr-40', 'mr-44', 'mr-48',
                'mr-52', 'mr-56', 'mr-60', 'mr-64', 'mr-72', 'mr-80',
                'mr-96', 'mr-auto',
                'mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6',
                'mb-8', 'mb-10', 'mb-12', 'mb-16', 'mb-20', 'mb-24',
                'mb-28', 'mb-32', 'mb-36', 'mb-40', 'mb-44', 'mb-48',
                'mb-52', 'mb-56', 'mb-60', 'mb-64', 'mb-72', 'mb-80',
                'mb-96', 'mb-auto',
                'ml-0', 'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6',
                'ml-8', 'ml-10', 'ml-12', 'ml-16', 'ml-20', 'ml-24',
                'ml-28', 'ml-32', 'ml-36', 'ml-40', 'ml-44', 'ml-48',
                'ml-52', 'ml-56', 'ml-60', 'ml-64', 'ml-72', 'ml-80',
                'ml-96', 'ml-auto'
            ],

            // Sizing
            width: [
                'w-0', 'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7',
                'w-8', 'w-9', 'w-10', 'w-11', 'w-12', 'w-14', 'w-16',
                'w-20', 'w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'w-44',
                'w-48', 'w-52', 'w-56', 'w-60', 'w-64', 'w-72', 'w-80',
                'w-96', 'w-auto', 'w-full', 'w-screen'
            ],
            height: [
                'h-0', 'h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7',
                'h-8', 'h-9', 'h-10', 'h-11', 'h-12', 'h-14', 'h-16',
                'h-20', 'h-24', 'h-28', 'h-32', 'h-36', 'h-40', 'h-44',
                'h-48', 'h-52', 'h-56', 'h-60', 'h-64', 'h-72', 'h-80',
                'h-96', 'h-auto', 'h-full', 'h-screen'
            ],
            maxWidth: [
                'max-w-0', 'max-w-none', 'max-w-xs', 'max-w-sm', 'max-w-md',
                'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl',
                'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full',
                'max-w-min', 'max-w-max', 'max-w-fit', 'max-w-prose',
                'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg',
                'max-w-screen-xl', 'max-w-screen-2xl'
            ],
            maxHeight: [
                'max-h-0', 'max-h-none', 'max-h-full', 'max-h-screen',
                'max-h-svh', 'max-h-lvh', 'max-h-dvh', 'max-h-min', 'max-h-max',
                'max-h-fit'
            ],

            // Colors
            backgroundColors: [
                'bg-inherit', 'bg-current', 'bg-transparent', 'bg-black',
                'bg-white', 'bg-slate-50', 'bg-slate-100', 'bg-slate-200',
                'bg-slate-300', 'bg-slate-400', 'bg-slate-500', 'bg-slate-600',
                'bg-slate-700', 'bg-slate-800', 'bg-slate-900',
                'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300',
                'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700',
                'bg-gray-800', 'bg-gray-900',
                'bg-zinc-50', 'bg-zinc-100', 'bg-zinc-200', 'bg-zinc-300',
                'bg-zinc-400', 'bg-zinc-500', 'bg-zinc-600', 'bg-zinc-700',
                'bg-zinc-800', 'bg-zinc-900',
                'bg-neutral-50', 'bg-neutral-100', 'bg-neutral-200',
                'bg-neutral-300', 'bg-neutral-400', 'bg-neutral-500',
                'bg-neutral-600', 'bg-neutral-700', 'bg-neutral-800',
                'bg-neutral-900',
                'bg-stone-50', 'bg-stone-100', 'bg-stone-200', 'bg-stone-300',
                'bg-stone-400', 'bg-stone-500', 'bg-stone-600', 'bg-stone-700',
                'bg-stone-800', 'bg-stone-900',
                'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300',
                'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700',
                'bg-red-800', 'bg-red-900',
                'bg-orange-50', 'bg-orange-100', 'bg-orange-200', 'bg-orange-300',
                'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
                'bg-orange-800', 'bg-orange-900',
                'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300',
                'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700',
                'bg-amber-800', 'bg-amber-900',
                'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300',
                'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
                'bg-yellow-800', 'bg-yellow-900',
                'bg-lime-50', 'bg-lime-100', 'bg-lime-200', 'bg-lime-300',
                'bg-lime-400', 'bg-lime-500', 'bg-lime-600', 'bg-lime-700',
                'bg-lime-800', 'bg-lime-900',
                'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300',
                'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700',
                'bg-green-800', 'bg-green-900',
                'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200',
                'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500',
                'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800',
                'bg-emerald-900',
                'bg-teal-50', 'bg-teal-100', 'bg-teal-200', 'bg-teal-300',
                'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
                'bg-teal-800', 'bg-teal-900',
                'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-200', 'bg-cyan-300',
                'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700',
                'bg-cyan-800', 'bg-cyan-900',
                'bg-sky-50', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300',
                'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700',
                'bg-sky-800', 'bg-sky-900',
                'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300',
                'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
                'bg-blue-800', 'bg-blue-900',
                'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300',
                'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
                'bg-indigo-800', 'bg-indigo-900',
                'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-300',
                'bg-violet-400', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700',
                'bg-violet-800', 'bg-violet-900',
                'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-300',
                'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
                'bg-purple-800', 'bg-purple-900',
                'bg-fuchsia-50', 'bg-fuchsia-100', 'bg-fuchsia-200',
                'bg-fuchsia-300', 'bg-fuchsia-400', 'bg-fuchsia-500',
                'bg-fuchsia-600', 'bg-fuchsia-700', 'bg-fuchsia-800',
                'bg-fuchsia-900',
                'bg-pink-50', 'bg-pink-100', 'bg-pink-200', 'bg-pink-300',
                'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700',
                'bg-pink-800', 'bg-pink-900',
                'bg-rose-50', 'bg-rose-100', 'bg-rose-200', 'bg-rose-300',
                'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700',
                'bg-rose-800', 'bg-rose-900'
            ],

            // Typography
            fontSize: [
                'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
                'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
                'text-7xl', 'text-8xl', 'text-9xl'
            ],
            fontWeight: [
                'font-thin', 'font-extralight', 'font-light', 'font-normal',
                'font-medium', 'font-semibold', 'font-bold', 'font-extrabold',
                'font-black'
            ],
            textAlign: [
                'text-left', 'text-center', 'text-right', 'text-justify',
                'text-start', 'text-end'
            ],

            // Borders
            borderRadius: [
                'rounded-none', 'rounded-sm', 'rounded', 'rounded-md',
                'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl',
                'rounded-full'
            ],
            borderWidth: [
                'border-0', 'border', 'border-2', 'border-4', 'border-8',
                'border-t-0', 'border-t', 'border-t-2', 'border-t-4', 'border-t-8',
                'border-r-0', 'border-r', 'border-r-2', 'border-r-4', 'border-r-8',
                'border-b-0', 'border-b', 'border-b-2', 'border-b-4', 'border-b-8',
                'border-l-0', 'border-l', 'border-l-2', 'border-l-4', 'border-l-8'
            ],

            // Effects
            shadow: [
                'shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg',
                'shadow-xl', 'shadow-2xl', 'shadow-inner'
            ],
            opacity: [
                'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20',
                'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50',
                'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80',
                'opacity-90', 'opacity-95', 'opacity-100'
            ],

            // Transitions & Animation
            transition: [
                'transition-none', 'transition-all', 'transition',
                'transition-colors', 'transition-opacity', 'transition-shadow',
                'transition-transform'
            ],
            duration: [
                'duration-75', 'duration-100', 'duration-150', 'duration-200',
                'duration-300', 'duration-500', 'duration-700', 'duration-1000'
            ],
            ease: [
                'ease-linear', 'ease-in', 'ease-out', 'ease-in-out'
            ],

            // Transform
            scale: [
                'scale-0', 'scale-50', 'scale-75', 'scale-90', 'scale-95',
                'scale-100', 'scale-105', 'scale-110', 'scale-125',
                'scale-150', 'scale-x-0', 'scale-x-50', 'scale-x-75',
                'scale-x-90', 'scale-x-95', 'scale-x-100', 'scale-x-105',
                'scale-x-110', 'scale-x-125', 'scale-x-150', 'scale-y-0',
                'scale-y-50', 'scale-y-75', 'scale-y-90', 'scale-y-95',
                'scale-y-100', 'scale-y-105', 'scale-y-110', 'scale-y-125',
                'scale-y-150'
            ],
            rotate: [
                'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-6',
                'rotate-12', 'rotate-45', 'rotate-90', 'rotate-180',
                'rotate-270', 'rotate-360'
            ]
        };
    }

    createAutocompleteDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'autocomplete-dropdown';
        this.dropdown.style.cssText = `
            position: absolute;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        `;

        document.body.appendChild(this.dropdown);
    }

    initializeEvents() {
        // Input events
        this.editorElement.addEventListener('input', (e) => this.handleInput(e));
        this.editorElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.editorElement.addEventListener('click', () => this.hide());

        // Focus/blur events
        this.editorElement.addEventListener('blur', () => {
            setTimeout(() => this.hide(), 200);
        });

        // Global events
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target) && e.target !== this.editorElement) {
                this.hide();
            }
        });
    }

    handleInput(e) {
        const cursorPos = this.editorElement.selectionStart;
        const textBeforeCursor = this.editorElement.value.substring(0, cursorPos);
        const currentLine = textBeforeCursor.split('\n').pop();

        // Check if we're in a class attribute
        const classMatch = currentLine.match(/class=["']([^"']*)$/);
        if (classMatch) {
            this.currentContext = {
                type: 'class',
                currentClasses: classMatch[1],
                startPos: cursorPos - classMatch[1].length
            };

            const currentClass = this.getCurrentClass(currentLine);
            if (currentClass.length >= 1) {
                this.showSuggestions(currentClass);
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    }

    getCurrentClass(line) {
        const match = line.match(/class=["']([^"']*)$/);
        if (match) {
            const classes = match[1].split(/\s+/);
            return classes[classes.length - 1] || '';
        }
        return '';
    }

    showSuggestions(partialClass) {
        const allClasses = this.getAllClasses();
        this.suggestions = allClasses.filter(cls =>
            cls.toLowerCase().includes(partialClass.toLowerCase()) &&
            cls.toLowerCase() !== partialClass.toLowerCase()
        );

        if (this.suggestions.length === 0) {
            this.hide();
            return;
        }

        // Sort suggestions by relevance
        this.suggestions.sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(partialClass.toLowerCase());
            const bStarts = b.toLowerCase().startsWith(partialClass.toLowerCase());

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return a.localeCompare(b);
        });

        // Limit to top 10 suggestions
        this.suggestions = this.suggestions.slice(0, 10);
        this.currentIndex = -1;

        this.renderDropdown();
        this.positionDropdown();
        this.show();
    }

    getAllClasses() {
        const allClasses = [];
        Object.values(this.tailwindClasses).forEach(category => {
            if (Array.isArray(category)) {
                allClasses.push(...category);
            }
        });

        // Add common responsive and state variants
        const prefixes = ['hover:', 'focus:', 'active:', 'disabled:', 'group-hover:', 'group-focus:'];
        const responsive = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];

        const variants = [];
        allClasses.forEach(cls => {
            prefixes.forEach(prefix => {
                variants.push(prefix + cls);
            });
            responsive.forEach(resp => {
                variants.push(resp + cls);
            });
        });

        return [...allClasses, ...variants];
    }

    renderDropdown() {
        this.dropdown.innerHTML = '';

        this.suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid var(--border-subtle);
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s ease;
            `;

            if (index === this.currentIndex) {
                item.style.background = 'var(--accent-primary)';
                item.style.color = 'white';
            }

            // Add icon for different types of classes
            const icon = this.getClassIcon(suggestion);

            item.innerHTML = `
                <span style="color: var(--accent-glow); font-size: 12px;">${icon}</span>
                <span>${suggestion}</span>
            `;

            item.addEventListener('click', () => this.selectSuggestion(suggestion));
            item.addEventListener('mouseenter', () => {
                this.currentIndex = index;
                this.renderDropdown();
            });

            this.dropdown.appendChild(item);
        });

        // Remove last border
        if (this.dropdown.lastChild) {
            this.dropdown.lastChild.style.borderBottom = 'none';
        }
    }

    getClassIcon(className) {
        if (className.includes('hover:')) return '🖱️';
        if (className.includes('focus:')) return '🎯';
        if (className.includes('active:')) return '⚡';
        if (className.includes('bg-')) return '🎨';
        if (className.includes('text-')) return '📝';
        if (className.includes('p-') || className.includes('m-')) return '📏';
        if (className.includes('w-') || className.includes('h-')) return '📐';
        if (className.includes('flex')) return '🔧';
        if (className.includes('grid')) return '⚏';
        if (className.includes('border')) return '🔲';
        if (className.includes('shadow')) return '🌑';
        if (className.includes('rounded')) return '⭕';
        if (className.includes('transition')) return '🔄';
        if (className.includes('opacity')) return '👁️';
        if (className.includes('scale') || className.includes('rotate')) return '🔄';
        return '✨';
    }

    positionDropdown() {
        const rect = this.editorElement.getBoundingClientRect();
        const cursorPos = this.editorElement.selectionStart;
        const textBeforeCursor = this.editorElement.value.substring(0, cursorPos);
        const currentLine = textBeforeCursor.split('\n').pop();

        // Calculate cursor position
        const lines = textBeforeCursor.split('\n');
        const lineHeight = 21; // Approximate line height
        const charWidth = 8.4; // Approximate character width for JetBrains Mono

        const top = rect.top + (lines.length - 1) * lineHeight;
        const left = rect.left + Math.min(currentLine.length * charWidth, rect.width - 200);

        this.dropdown.style.top = top + 'px';
        this.dropdown.style.left = left + 'px';
        this.dropdown.style.width = '300px';
    }

    handleKeyDown(e) {
        if (!this.isVisible) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentIndex = Math.min(this.currentIndex + 1, this.suggestions.length - 1);
                this.renderDropdown();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.currentIndex = Math.max(this.currentIndex - 1, -1);
                this.renderDropdown();
                break;

            case 'Enter':
            case 'Tab':
                e.preventDefault();
                if (this.currentIndex >= 0) {
                    this.selectSuggestion(this.suggestions[this.currentIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hide();
                break;
        }
    }

    selectSuggestion(suggestion) {
        if (!this.currentContext) return;

        const cursorPos = this.editorElement.selectionStart;
        const textBeforeCursor = this.editorElement.value.substring(0, cursorPos);
        const textAfterCursor = this.editorElement.value.substring(cursorPos);

        // Find the current class being typed
        const currentClassMatch = textBeforeCursor.match(/(\S+)$/);
        if (currentClassMatch) {
            const currentClass = currentClassMatch[1];
            const newValue = textBeforeCursor.substring(0, textBeforeCursor.length - currentClass.length) +
                             suggestion + ' ' + textAfterCursor;

            this.editorElement.value = newValue;
            this.editorElement.selectionStart = this.editorElement.selectionEnd =
                textBeforeCursor.length - currentClass.length + suggestion.length + 1;

            // Trigger input event to update syntax highlighting
            this.editorElement.dispatchEvent(new Event('input'));
        }

        this.hide();
    }

    show() {
        this.isVisible = true;
        this.dropdown.style.display = 'block';
    }

    hide() {
        this.isVisible = false;
        this.dropdown.style.display = 'none';
        this.currentIndex = -1;
        this.suggestions = [];
        this.currentContext = null;
    }

    // Public methods
    refresh() {
        this.hide();
    }

    destroy() {
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.parentNode.removeChild(this.dropdown);
        }
    }
}

// Export for use in main script
window.AutocompleteSystem = AutocompleteSystem;