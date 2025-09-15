// Tile Calculator JavaScript

class TileCalculator {
    constructor() {

        this.roomLength = document.getElementById('room-length');
        this.roomWidth = document.getElementById('room-width');
        this.tileLength = document.getElementById('tile-length');
        this.tileWidth = document.getElementById('tile-width');
        this.wasteFactor = document.getElementById('waste-factor');
        this.tilePrice = document.getElementById('tile-price');
        this.groutWidth = document.getElementById('grout-width');
        this.tilesPerBox = document.getElementById('tiles-per-box');

        this.setupPresetButtons();
        this.setupTileSpecificListeners();
    }

    // Basic calculator functionality
    getInputValue(id, defaultValue = 0) {
        const input = document.getElementById(id);
        if (!input) return defaultValue;
        return parseFloat(input.value) || defaultValue;
    }

    setResultValue(id, value, format = 'number') {
        const element = document.getElementById(id);
        if (element) {
            let formattedValue = value;
            if (format === 'currency') {
                formattedValue = `$${value.toFixed(2)}`;
            } else if (format === 'integer') {
                formattedValue = Math.round(value);
            } else if (format === 'percentage') {
                formattedValue = `${value.toFixed(2)}%`;
            }
            element.textContent = formattedValue;
        }
    }

    showLoading() {
        // Loading states removed - calculations happen automatically
    }

    hideLoading() {
        // Loading states removed - calculations happen automatically
    }

    showError(message) {
        console.error('Tile Calculator Error:', message);
        // You can add UI error display here
    }

    getCalculateButtonText() {
        return '📏 Calculate Tiles Needed';
    }

    setupTileSpecificListeners() {
        // Real-time calculation on input change
        [this.roomLength, this.roomWidth, this.tileLength, this.tileWidth,
         this.wasteFactor, this.tilePrice, this.groutWidth].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculate());
            }
        });

        // Box calculation on tiles per box change
        if (this.tilesPerBox) {
            this.tilesPerBox.addEventListener('input', () => this.updateBoxCount());
        }
    }

    setupPresetButtons() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                const [length, width] = size.split('x');
                this.tileLength.value = length;
                this.tileWidth.value = width;
                this.calculate();
            });
        });
    }

    calculate() {
        const roomL = this.getInputValue('room-length');
        const roomW = this.getInputValue('room-width');
        const tileL = this.getInputValue('tile-length');
        const tileW = this.getInputValue('tile-width');
        const waste = this.getInputValue('waste-factor', 10);
        const price = this.getInputValue('tile-price');
        const grout = this.getInputValue('grout-width', 3);

        if (roomL <= 0 || roomW <= 0 || tileL <= 0 || tileW <= 0) {
            this.showError('Please enter valid dimensions');
            return;
        }

        // Calculate room area in square feet
        const roomArea = roomL * roomW;

        // Calculate tile area in square feet (convert inches to feet)
        const tileAreaSqFt = (tileL * tileW) / 144;

        // Calculate base number of tiles needed
        const baseTiles = Math.ceil(roomArea / tileAreaSqFt);

        // Calculate tiles with waste factor
        const tilesWithWaste = Math.ceil(baseTiles * (1 + waste / 100));

        // Calculate grout coverage (approximate)
        const groutCoverage = this.calculateGroutCoverage(roomL, roomW, tileL, tileW, grout);

        // Calculate estimated cost
        const estimatedCost = roomArea * price;

        // Update display
        this.updateResults({
            roomArea: roomArea.toFixed(2),
            baseTiles: baseTiles,
            tilesWithWaste: tilesWithWaste,
            groutCoverage: groutCoverage.toFixed(2),
            estimatedCost: estimatedCost.toFixed(2)
        });

        this.updateBoxCount();
    }

    calculateGroutCoverage(roomL, roomW, tileL, tileW, groutMM) {
        // Convert grout width from mm to inches
        const groutInches = groutMM / 25.4;

        // Calculate approximate grout coverage
        // This is a simplified calculation
        const tilesPerRow = Math.ceil((roomL * 12) / (tileL + groutInches));
        const tilesPerColumn = Math.ceil((roomW * 12) / (tileW + groutInches));

        const horizontalGroutArea = tilesPerColumn * (roomL * 12) * groutInches;
        const verticalGroutArea = tilesPerRow * (roomW * 12) * groutInches;

        // Convert back to square feet
        return (horizontalGroutArea + verticalGroutArea) / 144;
    }

    updateResults(results) {
        this.setResultValue('room-area', results.roomArea, 'integer');
        this.setResultValue('tiles-needed', results.baseTiles, 'integer');
        this.setResultValue('tiles-with-waste', results.tilesWithWaste, 'integer');
        this.setResultValue('grout-coverage', results.groutCoverage, 'integer');
        this.setResultValue('estimated-cost', results.estimatedCost, 'currency');

        // Store for box calculation
        this.currentTilesNeeded = results.tilesWithWaste;
    }

    updateBoxCount() {
        const tilesPerBox = parseInt(this.tilesPerBox.value) || 0;
        const boxCountElement = document.getElementById('box-count');

        if (tilesPerBox > 0 && this.currentTilesNeeded) {
            const boxesNeeded = Math.ceil(this.currentTilesNeeded / tilesPerBox);
            boxCountElement.textContent = `${boxesNeeded} boxes`;
        } else {
            boxCountElement.textContent = '0 boxes';
        }
    }

    clear() {
        // Clear all inputs
        [this.roomLength, this.roomWidth, this.tileLength, this.tileWidth,
         this.tilePrice, this.tilesPerBox].forEach(input => {
            input.value = '';
        });

        // Reset to defaults
        this.wasteFactor.value = '10';
        this.groutWidth.value = '3';

        // Clear results
        document.getElementById('room-area').textContent = '0 sq ft';
        document.getElementById('tiles-needed').textContent = '0 tiles';
        document.getElementById('tiles-with-waste').textContent = '0 tiles';
        document.getElementById('grout-coverage').textContent = '0 sq ft';
        document.getElementById('estimated-cost').textContent = '$0.00';
        document.getElementById('box-count').textContent = '0 boxes';

        this.roomLength.focus();
    }

    showError(message) {
        // You could implement a toast notification or modal here
        console.error(message);
    }
}

// Common tile sizes for quick reference
const commonTileSizes = {
    '12x12': { length: 12, width: 12, name: '12" × 12" Standard' },
    '12x24': { length: 12, width: 24, name: '12" × 24" Plank' },
    '6x24': { length: 6, width: 24, name: '6" × 24" Wood-look' },
    '18x18': { length: 18, width: 18, name: '18" × 18" Large Format' },
    '24x24': { length: 24, width: 24, name: '24" × 24" Extra Large' },
    '4x4': { length: 4, width: 4, name: '4" × 4" Small' },
    '6x6': { length: 6, width: 6, name: '6" × 6" Medium' },
    '8x8': { length: 8, width: 8, name: '8" × 8" Traditional' }
};

// Waste factor recommendations
const wasteFactorGuide = {
    'straight': { min: 10, max: 15, description: 'Straight/Grid Pattern' },
    'diagonal': { min: 15, max: 20, description: 'Diagonal Pattern' },
    'herringbone': { min: 15, max: 25, description: 'Herringbone Pattern' },
    'complex': { min: 20, max: 30, description: 'Complex Patterns' },
    'irregular': { min: 15, max: 25, description: 'Irregular Rooms' }
};

// Utility functions
function getTileRecommendation(roomArea) {
    if (roomArea < 50) {
        return 'Consider 12"×12" or smaller tiles for better proportions';
    } else if (roomArea < 150) {
        return '12"×12" or 12"×24" tiles work well for this size room';
    } else if (roomArea < 300) {
        return '12"×24" or 18"×18" tiles are ideal for larger spaces';
    } else {
        return '18"×18" or 24"×24" large format tiles for expansive areas';
    }
}

function calculateGroutBags(groutCoverage, groutType = 'sanded') {
    // Standard grout coverage: 25 lb bag covers ~150-200 sq ft
    const coveragePerBag = groutType === 'sanded' ? 175 : 200;
    return Math.ceil(groutCoverage / coveragePerBag);
}

function estimateInstallationTime(tilesNeeded, complexity = 'medium') {
    const tilesPerHour = {
        'easy': 15,    // Large tiles, straight pattern
        'medium': 12,  // Standard tiles, basic pattern
        'hard': 8      // Small tiles or complex pattern
    };

    const hoursNeeded = tilesNeeded / tilesPerHour[complexity];
    return Math.ceil(hoursNeeded);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        new TileCalculator();
        console.log('Tile Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Tile Calculator:', error);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = '<p>⚠️ Calculator failed to load. Please refresh the page or try again later.</p>';
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(errorDiv, main.firstChild);
        }
    }
});

// Export for testing
// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new TileCalculator();
    } catch (error) {
        console.error('Failed to initialize Tile Calculator:', error);
    }
});
