// Baseboard & Trim Calculator JavaScript

class BaseboardCalculator {
    constructor() {
        this.roomPerimeter = document.getElementById('room-perimeter');
        this.roomLength = document.getElementById('room-length');
        this.roomWidth = document.getElementById('room-width');
        this.doorWidth = document.getElementById('door-width');
        this.windowWidth = document.getElementById('window-width');
        this.otherOpenings = document.getElementById('other-openings');
        this.corners = document.getElementById('corners');
        this.trimType = document.getElementById('trim-type');
        this.trimLength = document.getElementById('trim-length');
        this.pricePerFoot = document.getElementById('price-per-foot');
        this.wasteFactor = document.getElementById('waste-factor');
        this.nailsScrews = document.getElementById('nails-screws');
        this.caulkCost = document.getElementById('caulk-cost');
        this.paintPrimer = document.getElementById('paint-primer');
        this.laborCost = document.getElementById('labor-cost');

        this.calculateBtn = document.getElementById('calculate-btn');
        this.clearBtn = document.getElementById('clear-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clear());

        // Auto-calculate perimeter from dimensions
        [this.roomLength, this.roomWidth].forEach(input => {
            input.addEventListener('input', () => {
                this.updatePerimeter();
                this.calculate();
            });
        });

        // Real-time calculation on other inputs
        [this.roomPerimeter, this.doorWidth, this.windowWidth, this.otherOpenings,
         this.corners, this.trimType, this.trimLength, this.pricePerFoot,
         this.wasteFactor, this.nailsScrews, this.caulkCost, this.paintPrimer,
         this.laborCost].forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });

        // Update waste factor based on trim type
        this.trimType.addEventListener('change', () => {
            this.updateWasteFactorForTrimType();
            this.calculate();
        });
    }

    updatePerimeter() {
        const length = parseFloat(this.roomLength.value) || 0;
        const width = parseFloat(this.roomWidth.value) || 0;

        if (length > 0 && width > 0) {
            const perimeter = 2 * (length + width);
            this.roomPerimeter.value = perimeter.toFixed(1);
        }
    }

    updateWasteFactorForTrimType() {
        const trimType = this.trimType.value;
        const wasteFactors = {
            'baseboard': 10,
            'crown': 18,
            'chair-rail': 12,
            'quarter-round': 15,
            'shoe-molding': 15,
            'casing': 20
        };

        if (wasteFactors[trimType]) {
            this.wasteFactor.value = wasteFactors[trimType];
        }
    }

    calculate() {
        const perimeter = parseFloat(this.roomPerimeter.value) || 0;
        const doorW = parseFloat(this.doorWidth.value) || 0;
        const windowW = parseFloat(this.windowWidth.value) || 0;
        const otherW = parseFloat(this.otherOpenings.value) || 0;
        const numCorners = parseInt(this.corners.value) || 0;
        const trimLen = parseFloat(this.trimLength.value) || 12;
        const pricePerFt = parseFloat(this.pricePerFoot.value) || 0;
        const waste = parseFloat(this.wasteFactor.value) || 10;
        const nailsCost = parseFloat(this.nailsScrews.value) || 0;
        const caulkCostTotal = parseFloat(this.caulkCost.value) || 0;
        const paintCost = parseFloat(this.paintPrimer.value) || 0;
        const laborPerFt = parseFloat(this.laborCost.value) || 0;

        if (perimeter <= 0) {
            this.showError('Please enter room perimeter or dimensions');
            return;
        }

        // Calculate net linear feet needed
        const totalOpenings = doorW + windowW + otherW;
        const netLinearFeet = Math.max(0, perimeter - totalOpenings);

        // Add waste factor
        const linearFeetWithWaste = netLinearFeet * (1 + waste / 100);

        // Calculate pieces needed
        const piecesNeeded = Math.ceil(linearFeetWithWaste / trimLen);

        // Calculate cuts
        const cuts = this.calculateCuts(numCorners, this.trimType.value);

        // Calculate costs
        const trimCost = linearFeetWithWaste * pricePerFt;
        const laborTotal = netLinearFeet * laborPerFt;
        const totalCost = trimCost + nailsCost + caulkCostTotal + paintCost + laborTotal;

        // Update display
        this.updateResults({
            netLinearFeet: netLinearFeet.toFixed(1),
            linearFeetWithWaste: linearFeetWithWaste.toFixed(1),
            piecesNeeded: piecesNeeded,
            cornerCuts: cuts.cornerCuts,
            miterCuts: cuts.miterCuts,
            trimCost: trimCost.toFixed(2),
            nailsCost: nailsCost.toFixed(2),
            caulkCostTotal: caulkCostTotal.toFixed(2),
            paintCost: paintCost.toFixed(2),
            laborTotal: laborTotal.toFixed(2),
            totalCost: totalCost.toFixed(2)
        });
    }

    calculateCuts(corners, trimType) {
        let cornerCuts = 0;
        let miterCuts = 0;

        if (corners > 0) {
            if (trimType === 'crown') {
                // Crown molding requires compound miter cuts
                cornerCuts = corners;
                miterCuts = corners * 2; // Two cuts per corner
            } else {
                // Regular trim
                cornerCuts = corners;
                miterCuts = Math.floor(corners * 1.5); // Mix of coped and mitered
            }
        }

        return { cornerCuts, miterCuts };
    }

    updateResults(results) {
        document.getElementById('linear-feet-needed').textContent = `${results.netLinearFeet} ft`;
        document.getElementById('linear-feet-waste').textContent = `${results.linearFeetWithWaste} ft`;
        document.getElementById('pieces-needed').textContent = `${results.piecesNeeded} pieces`;
        document.getElementById('corner-cuts').textContent = results.cornerCuts;
        document.getElementById('miter-cuts').textContent = results.miterCuts;
        document.getElementById('total-cost').textContent = `$${results.totalCost}`;

        // Show cost breakdown if any costs are entered
        if (parseFloat(results.trimCost) > 0 || parseFloat(results.laborTotal) > 0) {
            document.getElementById('trim-cost').textContent = `$${results.trimCost}`;
            document.getElementById('fastener-cost').textContent = `$${results.nailsCost}`;
            document.getElementById('caulk-total').textContent = `$${results.caulkCostTotal}`;
            document.getElementById('paint-total').textContent = `$${results.paintCost}`;
            document.getElementById('labor-total').textContent = `$${results.laborTotal}`;
            document.getElementById('cost-breakdown').style.display = 'block';
        } else {
            document.getElementById('cost-breakdown').style.display = 'none';
        }
    }

    clear() {
        // Clear all inputs except defaults
        [this.roomPerimeter, this.roomLength, this.roomWidth, this.pricePerFoot,
         this.nailsScrews, this.caulkCost, this.paintPrimer, this.laborCost].forEach(input => {
            input.value = '';
        });

        // Reset to defaults
        this.doorWidth.value = '6';
        this.windowWidth.value = '0';
        this.otherOpenings.value = '0';
        this.corners.value = '4';
        this.trimType.value = 'baseboard';
        this.trimLength.value = '12';
        this.wasteFactor.value = '10';

        // Clear results
        document.getElementById('linear-feet-needed').textContent = '0 ft';
        document.getElementById('linear-feet-waste').textContent = '0 ft';
        document.getElementById('pieces-needed').textContent = '0 pieces';
        document.getElementById('corner-cuts').textContent = '0 cuts';
        document.getElementById('miter-cuts').textContent = '0 cuts';
        document.getElementById('total-cost').textContent = '$0.00';
        document.getElementById('cost-breakdown').style.display = 'none';

        this.roomPerimeter.focus();
    }

    showError(message) {
        console.error(message);
    }
}

// Trim pricing guide (national averages per linear foot)
const trimPricing = {
    'pine': { min: 1.50, max: 3.50, description: 'Pine - Budget friendly' },
    'poplar': { min: 2.00, max: 4.50, description: 'Poplar - Paint grade' },
    'oak': { min: 3.50, max: 8.00, description: 'Oak - Traditional stain grade' },
    'maple': { min: 4.00, max: 9.00, description: 'Maple - Smooth finish' },
    'cherry': { min: 6.00, max: 12.00, description: 'Cherry - Premium hardwood' },
    'mdf': { min: 1.00, max: 2.50, description: 'MDF - Smooth paint finish' }
};

// Standard trim profiles
const trimProfiles = {
    'baseboard': {
        'colonial': { height: '3.5"', complexity: 'simple' },
        'craftsman': { height: '5.25"', complexity: 'moderate' },
        'modern': { height: '4.5"', complexity: 'simple' },
        'traditional': { height: '6"', complexity: 'complex' }
    },
    'crown': {
        'simple': { projection: '3"', complexity: 'moderate' },
        'traditional': { projection: '4.5"', complexity: 'complex' },
        'elaborate': { projection: '6"', complexity: 'very complex' }
    }
};

// Installation difficulty factors
const installationDifficulty = {
    'baseboard': { skill: 'beginner', time_per_foot: 0.1 }, // hours
    'crown': { skill: 'advanced', time_per_foot: 0.3 },
    'chair-rail': { skill: 'intermediate', time_per_foot: 0.15 },
    'quarter-round': { skill: 'beginner', time_per_foot: 0.08 },
    'casing': { skill: 'intermediate', time_per_foot: 0.2 }
};

// Tool requirements by trim type
const toolRequirements = {
    'basic': ['miter saw', 'nail gun', 'measuring tape', 'level', 'coping saw'],
    'advanced': ['compound miter saw', 'pneumatic nailer', 'laser level', 'router', 'biscuit joiner'],
    'crown_molding': ['compound miter saw', 'crown stops', 'pneumatic nailer', 'coping saw', 'angle finder']
};

// Utility functions
function estimateInstallationTime(linearFeet, trimType, skillLevel = 'intermediate') {
    const baseTime = installationDifficulty[trimType]?.time_per_foot || 0.15;
    const skillMultiplier = {
        'beginner': 2.0,
        'intermediate': 1.0,
        'advanced': 0.7,
        'professional': 0.5
    };

    return linearFeet * baseTime * (skillMultiplier[skillLevel] || 1.0);
}

function calculateNailsNeeded(linearFeet, spacing = 16) {
    // Spacing in inches, typically 16" on center
    const nailsPerFoot = 12 / spacing;
    return Math.ceil(linearFeet * nailsPerFoot * 1.1); // 10% extra
}

function calculateCaulkTubes(linearFeet, gapSize = 'normal') {
    const coveragePerTube = {
        'small': 100, // linear feet
        'normal': 75,
        'large': 50
    };

    return Math.ceil(linearFeet / (coveragePerTube[gapSize] || 75));
}

function calculatePaintNeeded(linearFeet, trimHeight, coats = 2) {
    // Convert height from inches to feet
    const heightFt = trimHeight / 12;
    const surfaceArea = linearFeet * heightFt * 2; // Both sides
    const coverage = 350; // sq ft per gallon

    return Math.ceil((surfaceArea * coats) / coverage * 4) / 4; // Round to nearest quart
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    try {
        new BaseboardCalculator();
        console.log('Baseboard Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Baseboard Calculator:', error);
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
// BaseboardCalculator is already initialized above
