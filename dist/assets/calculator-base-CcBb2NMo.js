// Shared Calculator Base Class
// Provides common functionality for all calculators

class CalculatorBase {
    constructor(calculatorType, options = {}) {
        this.type = calculatorType;
        this.options = {
            enableValidation: true,
            enablePersistence: true,
            enableLoadingStates: true,
            ...options
        };
        
        this.inputs = new Map();
        this.results = new Map();
        this.isLoading = false;
        
        this.initializeCommonElements();
        this.setupValidation();
        this.loadSavedData();
    }

    initializeCommonElements() {
        // Common button elements
        this.calculateBtn = document.getElementById('calculate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        
        // Add common event listeners
        this.setupCommonEventListeners();
    }

    setupCommonEventListeners() {
        // Calculate button
        if (this.calculateBtn) {
            this.calculateBtn.addEventListener('click', () => this.handleCalculate());
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.handleClear());
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.handleCalculate();
            }
        });
    }

    setupValidation() {
        if (!this.options.enableValidation) return;
        
        // Add validation to all number inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        if (!this.options.enableValidation) return true;
        
        const value = parseFloat(input.value);
        const min = parseFloat(input.getAttribute('min')) || 0;
        const max = parseFloat(input.getAttribute('max')) || Infinity;
        
        return validateInput(input, {
            min,
            max,
            required: input.hasAttribute('required'),
            customMessage: input.getAttribute('data-error-message')
        });
    }

    handleCalculate() {
        if (this.isLoading) return;
        
        this.showLoading();
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                this.calculate();
                this.saveData();
            } catch (error) {
                console.error(`Error in ${this.type} calculation:`, error);
                this.showError('Calculation failed. Please check your inputs.');
            } finally {
                this.hideLoading();
            }
        }, 100);
    }

    handleClear() {
        // Clear all inputs
        document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(input => {
            input.value = '';
            input.classList.remove('error', 'valid');
        });

        // Clear validation messages
        document.querySelectorAll('.validation-message').forEach(msg => {
            msg.remove();
        });

        // Clear results
        this.clearResults();
        
        // Clear saved data
        this.clearSavedData();
        
        // Focus first input
        const firstInput = document.querySelector('input[type="number"], input[type="text"]');
        if (firstInput) firstInput.focus();
    }

    showLoading() {
        if (!this.options.enableLoadingStates) return;
        
        this.isLoading = true;
        
        if (this.calculateBtn) {
            this.calculateBtn.disabled = true;
            this.calculateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
        }
    }

    hideLoading() {
        if (!this.options.enableLoadingStates) return;
        
        this.isLoading = false;
        
        if (this.calculateBtn) {
            this.calculateBtn.disabled = false;
            this.calculateBtn.innerHTML = this.getCalculateButtonText();
        }
    }

    getCalculateButtonText() {
        // Override in child classes for custom button text
        return '📏 Calculate';
    }

    showError(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<p>⚠️ ${message}</p>`;
        
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(errorDiv, main.firstChild);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    clearResults() {
        // Override in child classes to clear specific results
        document.querySelectorAll('.result-value').forEach(el => {
            el.textContent = '0';
        });
    }

    // Data persistence methods
    saveData() {
        if (!this.options.enablePersistence) return;
        
        const data = {};
        document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(input => {
            if (input.value) {
                data[input.id] = input.value;
            }
        });
        
        localStorage.setItem(`calculator_${this.type}`, JSON.stringify(data));
    }

    loadSavedData() {
        if (!this.options.enablePersistence) return;
        
        try {
            const saved = localStorage.getItem(`calculator_${this.type}`);
            if (saved) {
                const data = JSON.parse(saved);
                Object.entries(data).forEach(([id, value]) => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.value = value;
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
        }
    }

    clearSavedData() {
        if (!this.options.enablePersistence) return;
        localStorage.removeItem(`calculator_${this.type}`);
    }

    // Utility methods
    getInputValue(id, defaultValue = 0) {
        const input = document.getElementById(id);
        return input ? parseFloat(input.value) || defaultValue : defaultValue;
    }

    setResultValue(id, value, format = 'number') {
        const element = document.getElementById(id);
        if (!element) return;
        
        switch (format) {
            case 'currency':
                element.textContent = `$${value.toFixed(2)}`;
                break;
            case 'percentage':
                element.textContent = `${value.toFixed(1)}%`;
                break;
            case 'integer':
                element.textContent = Math.round(value).toString();
                break;
            default:
                element.textContent = value.toFixed(2);
        }
    }

    // Abstract methods to be implemented by child classes
    calculate() {
        throw new Error('calculate() method must be implemented by child class');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorBase;
}
