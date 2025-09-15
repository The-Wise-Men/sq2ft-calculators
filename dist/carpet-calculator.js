// Carpet Calculator JavaScript

class CarpetCalculator {
    constructor() {
        this.roomLength = document.getElementById('room-length');
        this.roomWidth = document.getElementById('room-width');
        this.carpetWidth = document.getElementById('carpet-width');
        this.carpetPrice = document.getElementById('carpet-price');
        this.paddingPrice = document.getElementById('padding-price');
        this.installationPrice = document.getElementById('installation-price');
        this.wasteFactor = document.getElementById('waste-factor');
        this.seamDirection = document.getElementById('seam-direction');

        this.clearBtn = document.getElementById('clear-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.clearBtn.addEventListener('click', () => this.clear());

        // Real-time calculation on input change
        [this.roomLength, this.roomWidth, this.carpetWidth, this.carpetPrice,
         this.paddingPrice, this.installationPrice, this.wasteFactor, this.seamDirection].forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    calculate() {
        const roomL = parseFloat(this.roomLength.value) || 0;
        const roomW = parseFloat(this.roomWidth.value) || 0;
        const carpetW = parseFloat(this.carpetWidth.value) || 12;
        const carpetPricePerYd = parseFloat(this.carpetPrice.value) || 0;
        const paddingPricePerYd = parseFloat(this.paddingPrice.value) || 0;
        const installPricePerYd = parseFloat(this.installationPrice.value) || 0;
        const waste = parseFloat(this.wasteFactor.value) || 10;
        const seamDir = this.seamDirection.value;

        if (roomL <= 0 || roomW <= 0) {
            this.showError('Please enter valid room dimensions');
            return;
        }

        // Calculate room area
        const roomAreaSqFt = roomL * roomW;
        const roomAreaSqYd = roomAreaSqFt / 9;

        // Calculate carpet needed based on seam direction
        const carpetCalc = this.calculateCarpetNeeded(roomL, roomW, carpetW, seamDir, waste);

        // Calculate costs
        const carpetCost = carpetCalc.carpetNeededYards * carpetPricePerYd;
        const paddingCost = roomAreaSqYd * paddingPricePerYd;
        const installationCost = roomAreaSqYd * installPricePerYd;
        const totalCost = carpetCost + paddingCost + installationCost;

        // Update display
        this.updateResults({
            roomAreaSqFt: roomAreaSqFt.toFixed(1),
            roomAreaSqYd: roomAreaSqYd.toFixed(1),
            carpetNeededYards: carpetCalc.carpetNeededYards.toFixed(1),
            linearFeet: carpetCalc.linearFeet.toFixed(1),
            seamsRequired: carpetCalc.seamsRequired,
            carpetCost: carpetCost.toFixed(2),
            paddingCost: paddingCost.toFixed(2),
            installationCost: installationCost.toFixed(2),
            totalCost: totalCost.toFixed(2)
        });
    }

    calculateCarpetNeeded(roomL, roomW, carpetW, seamDirection, waste) {
        let linearFeet, seamsRequired, carpetNeededYards;

        if (seamDirection === 'optimal') {
            // Calculate both directions and choose the most efficient
            const lengthWise = this.calculateForDirection(roomL, roomW, carpetW);
            const widthWise = this.calculateForDirection(roomW, roomL, carpetW);

            if (lengthWise.carpetNeeded <= widthWise.carpetNeeded) {
                linearFeet = lengthWise.linearFeet;
                seamsRequired = lengthWise.seamsRequired;
                carpetNeededYards = lengthWise.carpetNeeded;
            } else {
                linearFeet = widthWise.linearFeet;
                seamsRequired = widthWise.seamsRequired;
                carpetNeededYards = widthWise.carpetNeeded;
            }
        } else if (seamDirection === 'length') {
            const calc = this.calculateForDirection(roomL, roomW, carpetW);
            linearFeet = calc.linearFeet;
            seamsRequired = calc.seamsRequired;
            carpetNeededYards = calc.carpetNeeded;
        } else { // width direction
            const calc = this.calculateForDirection(roomW, roomL, carpetW);
            linearFeet = calc.linearFeet;
            seamsRequired = calc.seamsRequired;
            carpetNeededYards = calc.carpetNeeded;
        }

        // Apply waste factor
        carpetNeededYards *= (1 + waste / 100);

        return {
            carpetNeededYards,
            linearFeet,
            seamsRequired
        };
    }

    calculateForDirection(primaryDim, secondaryDim, carpetWidth) {
        let seamsRequired = 0;
        let linearFeet;

        if (secondaryDim <= carpetWidth) {
            // No seams needed
            linearFeet = primaryDim;
            seamsRequired = 0;
        } else {
            // Seams needed
            const strips = Math.ceil(secondaryDim / carpetWidth);
            seamsRequired = strips - 1;
            linearFeet = primaryDim * strips;
        }

        // Convert to square yards
        const carpetNeeded = (linearFeet * carpetWidth) / 9;

        return {
            linearFeet,
            seamsRequired,
            carpetNeeded
        };
    }

    updateResults(results) {
        document.getElementById('room-area').textContent = `${results.roomAreaSqFt} sq ft`;
        document.getElementById('room-area-yards').textContent = `${results.roomAreaSqYd} sq yd`;
        document.getElementById('carpet-needed').textContent = `${results.carpetNeededYards} sq yd`;
        document.getElementById('linear-feet').textContent = `${results.linearFeet} ft`;
        document.getElementById('seams-required').textContent = results.seamsRequired;
        document.getElementById('total-cost').textContent = `$${results.totalCost}`;

        // Show cost breakdown if prices are entered
        if (parseFloat(results.carpetCost) > 0 || parseFloat(results.paddingCost) > 0 || parseFloat(results.installationCost) > 0) {
            document.getElementById('carpet-cost').textContent = `$${results.carpetCost}`;
            document.getElementById('padding-cost').textContent = `$${results.paddingCost}`;
            document.getElementById('installation-cost').textContent = `$${results.installationCost}`;
            document.getElementById('cost-breakdown').style.display = 'block';
        } else {
            document.getElementById('cost-breakdown').style.display = 'none';
        }
    }

    clear() {
        // Clear all inputs except defaults
        [this.roomLength, this.roomWidth, this.carpetPrice,
         this.paddingPrice, this.installationPrice].forEach(input => {
            input.value = '';
        });

        // Reset to defaults
        this.carpetWidth.value = '12';
        this.wasteFactor.value = '10';
        this.seamDirection.value = 'optimal';

        // Clear results
        document.getElementById('room-area').textContent = '0 sq ft';
        document.getElementById('room-area-yards').textContent = '0 sq yd';
        document.getElementById('carpet-needed').textContent = '0 sq yd';
        document.getElementById('linear-feet').textContent = '0 ft';
        document.getElementById('seams-required').textContent = '0';
        document.getElementById('total-cost').textContent = '$0.00';
        document.getElementById('cost-breakdown').style.display = 'none';

        this.roomLength.focus();
    }

    showError(message) {
        console.error(message);
        // Could implement toast notification here
    }
}

// Carpet pricing guidelines (national averages)
const carpetPricingGuide = {
    'budget': { min: 15, max: 25, description: 'Builder grade, basic fibers' },
    'mid-range': { min: 25, max: 45, description: 'Good quality, popular brands' },
    'premium': { min: 45, max: 80, description: 'High-end, luxury fibers' },
    'luxury': { min: 80, max: 150, description: 'Designer, specialty carpets' }
};

// Padding recommendations
const paddingGuide = {
    'basic': { price: 2.50, description: '4lb density, basic comfort' },
    'standard': { price: 3.50, description: '6lb density, good support' },
    'premium': { price: 5.00, description: '8lb density, maximum comfort' },
    'memory-foam': { price: 7.50, description: 'Memory foam, luxury feel' }
};

// Installation complexity factors
const installationComplexity = {
    'simple': { factor: 1.0, description: 'Rectangular room, no obstacles' },
    'moderate': { factor: 1.2, description: 'Some cuts around fixtures' },
    'complex': { factor: 1.5, description: 'Many obstacles, custom cuts' },
    'stairs': { factor: 2.0, description: 'Stair installation' }
};

// Utility functions
function estimateCarpetLife(quality, traffic) {
    const baseYears = {
        'budget': 5,
        'mid-range': 10,
        'premium': 15,
        'luxury': 20
    };

    const trafficMultiplier = {
        'low': 1.2,
        'medium': 1.0,
        'high': 0.7,
        'very-high': 0.5
    };

    return Math.round(baseYears[quality] * trafficMultiplier[traffic]);
}

function calculateMaintenanceCost(sqYards, quality) {
    const annualCostPerYard = {
        'budget': 2,
        'mid-range': 3,
        'premium': 4,
        'luxury': 6
    };

    return sqYards * annualCostPerYard[quality];
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    try {
        new CarpetCalculator();
        console.log('Carpet Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Carpet Calculator:', error);
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
// CarpetCalculator is already initialized above
