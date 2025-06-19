// Custom image resize module for Quill that's React 19 compatible
class ImageResize {
	quill: any;
	options: any;
	img: HTMLImageElement | null = null;
	overlay: HTMLElement | null = null;
	boxes: HTMLElement[] = [];

	constructor(quill: any, options: any = {}) {
		this.quill = quill;
		this.options = {
			modules: ['Resize', 'DisplaySize'],
			...options,
		};

		this.init();
	}

	init() {
		this.quill.root.addEventListener('click', this.handleClick.bind(this), false);
		this.quill.root.addEventListener('blur', this.hide.bind(this), false);
	}

	handleClick(evt: Event) {
		const target = evt.target as HTMLElement;
		if (target && target.tagName && target.tagName.toUpperCase() === 'IMG') {
			if (this.img === target) {
				return;
			}
			if (this.img) {
				this.hide();
			}
			this.show(target as HTMLImageElement);
		} else if (this.img) {
			this.hide();
		}
	}

	show(img: HTMLImageElement) {
		this.img = img;
		this.showOverlay();
		this.repositionElements();
	}

	showOverlay() {
		if (!this.img) return;

		this.overlay = document.createElement('div');
		Object.assign(this.overlay.style, {
			position: 'absolute',
			boxSizing: 'border-box',
			border: '1px dashed #444',
			pointerEvents: 'none',
			zIndex: '1000',
		});

		this.quill.root.parentNode?.appendChild(this.overlay);

		// Create resize handles
		this.createBox('nwse-resize', 'top-left');
		this.createBox('nwse-resize', 'bottom-right');
		this.createBox('nesw-resize', 'top-right');
		this.createBox('nesw-resize', 'bottom-left');

		// Display size if enabled
		if (this.options.modules.includes('DisplaySize')) {
			this.createDisplaySize();
		}
	}

	createBox(cursor: string, position: string) {
		if (!this.overlay) return;

		const box = document.createElement('div');
		Object.assign(box.style, {
			position: 'absolute',
			height: '12px',
			width: '12px',
			backgroundColor: '#fff',
			border: '1px solid #777',
			boxSizing: 'border-box',
			cursor,
			zIndex: '1001',
		});

		this.setBoxPosition(box, position);

		if (this.options.modules.includes('Resize')) {
			this.addResizeHandlers(box, position);
		}

		this.overlay.appendChild(box);
		this.boxes.push(box);
	}

	setBoxPosition(box: HTMLElement, position: string) {
		const positions: {
			[key: string]: { top?: string; left?: string; right?: string; bottom?: string };
		} = {
			'top-left': { top: '-6px', left: '-6px' },
			'top-right': { top: '-6px', right: '-6px' },
			'bottom-left': { bottom: '-6px', left: '-6px' },
			'bottom-right': { bottom: '-6px', right: '-6px' },
		};

		Object.assign(box.style, positions[position]);
	}

	addResizeHandlers(box: HTMLElement, position: string) {
		let isResizing = false;
		let startX = 0;
		let startY = 0;
		let startWidth = 0;
		let startHeight = 0;

		const startResize = (e: MouseEvent) => {
			if (!this.img) return;

			e.preventDefault();
			e.stopPropagation();

			isResizing = true;
			startX = e.clientX;
			startY = e.clientY;
			startWidth = parseInt(document.defaultView?.getComputedStyle(this.img).width || '0', 10);
			startHeight = parseInt(document.defaultView?.getComputedStyle(this.img).height || '0', 10);

			document.addEventListener('mousemove', doResize);
			document.addEventListener('mouseup', stopResize);
		};

		const doResize = (e: MouseEvent) => {
			if (!isResizing || !this.img) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;

			if (position.includes('right')) {
				newWidth = startWidth + deltaX;
			} else if (position.includes('left')) {
				newWidth = startWidth - deltaX;
			}

			if (position.includes('bottom')) {
				newHeight = startHeight + deltaY;
			} else if (position.includes('top')) {
				newHeight = startHeight - deltaY;
			}

			// Maintain aspect ratio
			const aspectRatio = startWidth / startHeight;
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				newHeight = newWidth / aspectRatio;
			} else {
				newWidth = newHeight * aspectRatio;
			}

			// Set minimum size
			newWidth = Math.max(newWidth, 50);
			newHeight = Math.max(newHeight, 50);

			this.img.style.width = newWidth + 'px';
			this.img.style.height = newHeight + 'px';

			this.repositionElements();
		};

		const stopResize = () => {
			isResizing = false;
			document.removeEventListener('mousemove', doResize);
			document.removeEventListener('mouseup', stopResize);
		};

		box.addEventListener('mousedown', startResize);
	}

	createDisplaySize() {
		if (!this.overlay || !this.img) return;

		const display = document.createElement('div');
		Object.assign(display.style, {
			position: 'absolute',
			top: '-25px',
			left: '0',
			backgroundColor: '#333',
			color: '#fff',
			padding: '2px 6px',
			fontSize: '12px',
			borderRadius: '3px',
			zIndex: '1002',
		});

		const updateDisplay = () => {
			if (!this.img) return;
			const width = this.img.clientWidth || this.img.naturalWidth;
			const height = this.img.clientHeight || this.img.naturalHeight;
			display.textContent = `${Math.round(width)} × ${Math.round(height)}`;
		};

		updateDisplay();
		this.overlay.appendChild(display);

		// Update display on resize
		const observer = new ResizeObserver(updateDisplay);
		observer.observe(this.img);
	}

	repositionElements() {
		if (!this.img || !this.overlay) return;

		const imgRect = this.img.getBoundingClientRect();
		const containerRect = this.quill.root.getBoundingClientRect();

		Object.assign(this.overlay.style, {
			left: `${imgRect.left - containerRect.left - 1}px`,
			top: `${imgRect.top - containerRect.top - 1}px`,
			width: `${imgRect.width + 2}px`,
			height: `${imgRect.height + 2}px`,
		});
	}

	hide() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
		this.boxes = [];
		this.img = null;
	}
}

export default ImageResize;
