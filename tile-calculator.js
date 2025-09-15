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

        const roomArea = roomL * roomW;
        const tileArea = (tileL * tileW) / 144; // Convert to square feet
        const baseTiles = Math.ceil(roomArea / tileArea);
        const tilesWithWaste = Math.ceil(baseTiles * (1 + waste / 100));
        const groutCoverage = this.calculateGroutCoverage(roomL, roomW, tileL, tileW, grout);
        const estimatedCost = tilesWithWaste * price;

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
        const tileLInches = tileL;
        const tileWInches = tileW;
        const groutInches = groutMM / 25.4;

        const tilesPerRow = Math.ceil(roomW * 12 / tileWInches);
        const tilesPerCol = Math.ceil(roomL * 12 / tileLInches);

        const horizontalGroutLength = (tilesPerRow - 1) * roomW * 12;
        const verticalGroutLength = (tilesPerCol - 1) * roomL * 12;

        const horizontalGroutArea = horizontalGroutLength * groutInches;
        const verticalGroutArea = verticalGroutLength * groutInches;

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
            const boxCount = Math.ceil(this.currentTilesNeeded / tilesPerBox);
            this.setResultValue('box-count', boxCount, 'integer');
        }
    }

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

    showError(message) {
        console.error('Tile Calculator Error:', message);
        // You can add UI error display here
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are available
    setTimeout(() => {
        try {
            new TileCalculator();
        } catch (error) {
            console.error('Failed to initialize Tile Calculator:', error);
        }
    }, 100);
});
