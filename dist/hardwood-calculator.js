// Hardwood Flooring Calculator JavaScript

class HardwoodCalculator {
    constructor() {
        this.roomLength = document.getElementById('room-length');
        this.roomWidth = document.getElementById('room-width');
        this.plankWidth = document.getElementById('plank-width');
        this.plankLength = document.getElementById('plank-length');
        this.plankThickness = document.getElementById('plank-thickness');
        this.boardPrice = document.getElementById('board-price');
        this.wasteFactor = document.getElementById('waste-factor');
        this.layoutPattern = document.getElementById('layout-pattern');
        this.installationCost = document.getElementById('installation-cost');
        this.underlaymentCost = document.getElementById('underlayment-cost');

        this.calculateBtn = document.getElementById('calculate-btn');
        this.clearBtn = document.getElementById('clear-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clear());

        // Real-time calculation on input change
        [this.roomLength, this.roomWidth, this.plankWidth, this.plankLength,
         this.plankThickness, this.boardPrice, this.wasteFactor, this.layoutPattern,
         this.installationCost, this.underlaymentCost].forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });

        // Update waste factor based on pattern
        this.layoutPattern.addEventListener('change', () => {
            this.updateWasteFactorForPattern();
            this.calculate();
        });
    }

    updateWasteFactorForPattern() {
        const pattern = this.layoutPattern.value;
        const wasteFactors = {
            'straight': 10,
            'staggered': 12,
            'herringbone': 22,
            'diagonal': 17
        };

        if (wasteFactors[pattern]) {
            this.wasteFactor.value = wasteFactors[pattern];
        }
    }

    calculate() {
        const roomL = parseFloat(this.roomLength.value) || 0;
        const roomW = parseFloat(this.roomWidth.value) || 0;
        const plankW = parseFloat(this.plankWidth.value) || 5;
        const plankL = this.getPlankLength();
        const plankT = parseFloat(this.plankThickness.value) || 0.75;
        const boardPricePerBF = parseFloat(this.boardPrice.value) || 0;
        const waste = parseFloat(this.wasteFactor.value) || 10;
        const installCost = parseFloat(this.installationCost.value) || 0;
        const underlayment = parseFloat(this.underlaymentCost.value) || 0;

        if (roomL <= 0 || roomW <= 0) {
            this.showError('Please enter valid room dimensions');
            return;
        }

        // Calculate room area
        const roomAreaSqFt = roomL * roomW;

        // Calculate board feet needed
        const boardFeetPerSqFt = plankT / 12; // Convert thickness to feet
        const baseBoardFeet = roomAreaSqFt * boardFeetPerSqFt;
        const boardFeetWithWaste = baseBoardFeet * (1 + waste / 100);

        // Calculate planks needed
        const plankAreaSqFt = (plankW * plankL) / 144; // Convert to sq ft
        const planksNeeded = Math.ceil(roomAreaSqFt / plankAreaSqFt);
        const planksWithWaste = Math.ceil(planksNeeded * (1 + waste / 100));

        // Calculate linear feet
        const linearFeet = planksWithWaste * plankL;

        // Calculate costs
        const woodCost = boardFeetWithWaste * boardPricePerBF;
        const underlaymentTotal = roomAreaSqFt * underlayment;
        const installationTotal = roomAreaSqFt * installCost;
        const totalCost = woodCost + underlaymentTotal + installationTotal;

        // Update display
        this.updateResults({
            roomAreaSqFt: roomAreaSqFt.toFixed(1),
            boardFeet: boardFeetWithWaste.toFixed(1),
            planksNeeded: planksNeeded,
            planksWithWaste: planksWithWaste,
            linearFeet: linearFeet.toFixed(1),
            woodCost: woodCost.toFixed(2),
            underlaymentTotal: underlaymentTotal.toFixed(2),
            installationTotal: installationTotal.toFixed(2),
            totalCost: totalCost.toFixed(2)
        });
    }

    getPlankLength() {
        const lengthValue = this.plankLength.value;
        if (lengthValue === 'mixed') {
            // For mixed lengths, use average of 4 feet
            return 4;
        }
        return parseFloat(lengthValue) || 4;
    }

    updateResults(results) {
        document.getElementById('room-area').textContent = `${results.roomAreaSqFt} sq ft`;
        document.getElementById('board-feet').textContent = `${results.boardFeet} bf`;
        document.getElementById('planks-needed').textContent = `${results.planksNeeded} planks`;
        document.getElementById('planks-with-waste').textContent = `${results.planksWithWaste} planks`;
        document.getElementById('linear-feet').textContent = `${results.linearFeet} ft`;
        document.getElementById('total-cost').textContent = `$${results.totalCost}`;

        // Show cost breakdown if prices are entered
        if (parseFloat(results.woodCost) > 0 || parseFloat(results.underlaymentTotal) > 0 || parseFloat(results.installationTotal) > 0) {
            document.getElementById('wood-cost').textContent = `$${results.woodCost}`;
            document.getElementById('underlayment-total').textContent = `$${results.underlaymentTotal}`;
            document.getElementById('installation-total').textContent = `$${results.installationTotal}`;
            document.getElementById('cost-breakdown').style.display = 'block';
        } else {
            document.getElementById('cost-breakdown').style.display = 'none';
        }
    }

    clear() {
        // Clear all inputs except defaults
        [this.roomLength, this.roomWidth, this.boardPrice,
         this.installationCost, this.underlaymentCost].forEach(input => {
            input.value = '';
        });

        // Reset to defaults
        this.plankWidth.value = '5';
        this.plankLength.value = '4';
        this.plankThickness.value = '0.75';
        this.wasteFactor.value = '10';
        this.layoutPattern.value = 'straight';

        // Clear results
        document.getElementById('room-area').textContent = '0 sq ft';
        document.getElementById('board-feet').textContent = '0 bf';
        document.getElementById('planks-needed').textContent = '0 planks';
        document.getElementById('planks-with-waste').textContent = '0 planks';
        document.getElementById('linear-feet').textContent = '0 ft';
        document.getElementById('total-cost').textContent = '$0.00';
        document.getElementById('cost-breakdown').style.display = 'none';

        this.roomLength.focus();
    }

    showError(message) {
        console.error(message);
    }
}

// Hardwood species pricing guide (national averages per board foot)
const hardwoodPricing = {
    'oak': { min: 3.50, max: 8.00, description: 'Red/White Oak - Most popular' },
    'maple': { min: 4.00, max: 9.00, description: 'Hard Maple - Durable, light' },
    'cherry': { min: 6.00, max: 12.00, description: 'Cherry - Premium hardwood' },
    'walnut': { min: 8.00, max: 15.00, description: 'Black Walnut - Luxury' },
    'hickory': { min: 4.50, max: 9.50, description: 'Hickory - Very hard' },
    'ash': { min: 3.00, max: 7.00, description: 'Ash - Strong, flexible' },
    'birch': { min: 3.50, max: 7.50, description: 'Birch - Smooth grain' }
};

// Installation complexity factors
const hardwoodInstallationComplexity = {
    'basic': { multiplier: 1.0, description: 'Simple rectangular room' },
    'moderate': { multiplier: 1.3, description: 'Some obstacles, closets' },
    'complex': { multiplier: 1.6, description: 'Many obstacles, custom cuts' },
    'stairs': { multiplier: 2.5, description: 'Stair installation' }
};

// Subfloor requirements
const subfloorRequirements = {
    'concrete': {
        'solid': 'Not recommended without sleeper system',
        'engineered': 'Requires moisture barrier and proper adhesive'
    },
    'plywood': {
        'solid': 'Ideal - nail/staple installation',
        'engineered': 'Excellent - multiple installation methods'
    },
    'osb': {
        'solid': 'Acceptable if properly sealed',
        'engineered': 'Good with proper preparation'
    }
};

// Utility functions
function calculateAcclimationTime(species, thickness, climate) {
    const baseTime = thickness < 0.5 ? 3 : 5; // days
    const speciesMultiplier = {
        'oak': 1.0,
        'maple': 1.2,
        'cherry': 1.3,
        'walnut': 1.1,
        'hickory': 0.9
    };

    const climateMultiplier = {
        'dry': 1.5,
        'normal': 1.0,
        'humid': 0.8
    };

    return Math.ceil(baseTime * (speciesMultiplier[species] || 1.0) * (climateMultiplier[climate] || 1.0));
}

function estimateInstallationTime(sqFt, complexity = 'basic', experience = 'diy') {
    const baseRate = {
        'professional': 80, // sq ft per day
        'experienced_diy': 40,
        'diy': 25
    };

    const complexityMultiplier = {
        'basic': 1.0,
        'moderate': 0.7,
        'complex': 0.5
    };

    const dailyRate = baseRate[experience] * complexityMultiplier[complexity];
    return Math.ceil(sqFt / dailyRate);
}

function calculateMoistureContent(species, environment) {
    // Equilibrium moisture content recommendations
    const emc = {
        'dry_climate': 6, // Southwest US
        'normal': 8,     // Most of US
        'humid': 11      // Southeast, coastal areas
    };

    return emc[environment] || 8;
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    try {
        new HardwoodCalculator();
        console.log('Hardwood Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Hardwood Calculator:', error);
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
// HardwoodCalculator is already initialized above
