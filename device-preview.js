// Simple Device Preview
class DevicePreview {
    constructor(previewFrame, previewContainer) {
        this.previewFrame = previewFrame;
        this.previewContainer = previewContainer;
        this.currentDevice = 'desktop';

        // Simple device presets
        this.devices = {
            desktop: {
                name: 'Desktop',
                width: '100%',
                height: '100%'
            },
            tablet: {
                name: 'Tablet',
                width: '768px',
                height: '1024px'
            },
            mobile: {
                name: 'Mobile',
                width: '375px',
                height: '667px'
            }
        };

        this.init();
    }

    init() {
        this.createDeviceSelector();
        this.setDevice('desktop');
    }

    createDeviceSelector() {
        // Create device selector container
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'device-selector';
        selectorContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
            background: rgba(30, 30, 40, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px;
            backdrop-filter: blur(10px);
        `;

        // Create select element
        const select = document.createElement('select');
        select.className = 'device-select';
        select.style.cssText = `
            background: rgba(60, 60, 80, 0.8);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 6px 8px;
            font-size: 12px;
            cursor: pointer;
            outline: none;
        `;

        // Add options for each device
        Object.keys(this.devices).forEach(deviceKey => {
            const option = document.createElement('option');
            option.value = deviceKey;
            option.textContent = this.devices[deviceKey].name;
            if (deviceKey === this.currentDevice) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Add change event listener
        select.addEventListener('change', (e) => {
            this.setDevice(e.target.value);
        });

        selectorContainer.appendChild(select);
        this.previewContainer.appendChild(selectorContainer);
    }

    setDevice(deviceType) {
        if (!this.devices[deviceType]) return;

        this.currentDevice = deviceType;
        const device = this.devices[deviceType];

        // Apply device dimensions to preview frame
        if (deviceType === 'desktop') {
            this.previewFrame.style.cssText = `
                width: ${device.width};
                height: ${device.height};
                border: none;
                border-radius: 0;
                background: white;
            `;
        } else {
            // Center the device frame
            this.previewContainer.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding: 20px;
            `;

            this.previewFrame.style.cssText = `
                width: ${device.width};
                height: ${device.height};
                border: 2px solid #444;
                border-radius: 8px;
                background: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 100%;
                max-height: 100%;
            `;
        }

        // Update select element if it exists
        const select = this.previewContainer.querySelector('.device-select');
        if (select) {
            select.value = deviceType;
        }
    }

    getCurrentDevice() {
        return this.currentDevice;
    }

    getDevices() {
        return this.devices;
    }

    // Method to update preview content (maintains interface compatibility)
    updatePreview(content) {
        if (this.previewFrame && this.previewFrame.srcdoc !== undefined) {
            this.previewFrame.srcdoc = content;
        }
    }

    refresh() {
        // Simple refresh - just reset current device
        this.setDevice(this.currentDevice);
    }

  getCurrentDimensions() {
    // Return current device dimensions for compatibility
    const device = this.devices[this.currentDevice];
    return {
        width: device.width,
        height: device.height,
        device: this.currentDevice
    };
  }

  destroy() {
        // Remove device selector if it exists
        const selector = this.previewContainer.querySelector('.device-selector');
        if (selector) {
            selector.remove();
        }
    }
}