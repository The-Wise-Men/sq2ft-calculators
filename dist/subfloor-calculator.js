// Subfloor Calculator JavaScript

class SubfloorCalculator {
    constructor() {
        this.roomLength = document.getElementById('room-length');
        this.roomWidth = document.getElementById('room-width');
        this.materialType = document.getElementById('material-type');
        this.materialThickness = document.getElementById('material-thickness');
        this.sheetSize = document.getElementById('sheet-size');
        this.sheetPrice = document.getElementById('sheet-price');
        this.joistSpacing = document.getElementById('joist-spacing');
        this.fastenerType = document.getElementById('fastener-type');
        this.wasteFactor = document.getElementById('waste-factor');
        this.fastenerPrice = document.getElementById('fastener-price');
        this.underlaymentType = document.getElementById('underlayment-type');
        this.underlaymentPrice = document.getElementById('underlayment-price');
        this.laborCost = document.getElementById('labor-cost');

        this.clearBtn = document.getElementById('clear-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clear());

        // Real-time calculation on input change
        [this.roomLength, this.roomWidth, this.materialType, this.materialThickness,
         this.sheetSize, this.sheetPrice, this.joistSpacing, this.fastenerType,
         this.wasteFactor, this.fastenerPrice, this.underlaymentType,
         this.underlaymentPrice, this.laborCost].forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    calculate() {
        const roomL = parseFloat(this.roomLength.value) || 0;
        const roomW = parseFloat(this.roomWidth.value) || 0;
        const sheetSize = this.getSheetDimensions();
        const sheetPriceEach = parseFloat(this.sheetPrice.value) || 0;
        const waste = parseFloat(this.wasteFactor.value) || 10;
        const fastenerCost = parseFloat(this.fastenerPrice.value) || 0;
        const underlaymentCostPerSqFt = parseFloat(this.underlaymentPrice.value) || 0;
        const laborPerSqFt = parseFloat(this.laborCost.value) || 0;

        if (roomL <= 0 || roomW <= 0) {
            this.showError('Please enter valid room dimensions');
            return;
        }

        // Calculate room area
        const roomAreaSqFt = roomL * roomW;

        // Calculate sheets needed
        const sheetAreaSqFt = sheetSize.width * sheetSize.length;
        const baseSheetsNeeded = Math.ceil(roomAreaSqFt / sheetAreaSqFt);
        const sheetsWithWaste = Math.ceil(baseSheetsNeeded * (1 + waste / 100));

        // Calculate fasteners needed
        const fasteners = this.calculateFasteners(roomAreaSqFt);

        // Calculate adhesive tubes (if using glue + screws)
        const adhesiveTubes = this.fastenerType.value === 'glue-screws' ?
            Math.ceil(roomAreaSqFt / 300) : 0; // 1 tube per 300 sq ft

        // Calculate costs
        const materialCost = sheetsWithWaste * sheetPriceEach;
        const underlaymentTotal = this.underlaymentType.value !== 'none' ?
            roomAreaSqFt * underlaymentCostPerSqFt : 0;
        const laborTotal = roomAreaSqFt * laborPerSqFt;
        const totalCost = materialCost + fastenerCost + underlaymentTotal + laborTotal;

        // Update display
        this.updateResults({
            roomAreaSqFt: roomAreaSqFt.toFixed(1),
            baseSheetsNeeded: baseSheetsNeeded,
            sheetsWithWaste: sheetsWithWaste,
            fastenersNeeded: fasteners,
            adhesiveTubes: adhesiveTubes,
            materialCost: materialCost.toFixed(2),
            fastenerCost: fastenerCost.toFixed(2),
            underlaymentTotal: underlaymentTotal.toFixed(2),
            laborTotal: laborTotal.toFixed(2),
            totalCost: totalCost.toFixed(2)
        });
    }

    getSheetDimensions() {
        const sizeMap = {
            '4x8': { width: 4, length: 8 },
            '4x10': { width: 4, length: 10 },
            '4x12': { width: 4, length: 12 }
        };
        return sizeMap[this.sheetSize.value] || { width: 4, length: 8 };
    }

    calculateFasteners(areaSquareFeet) {
        const joistSpacing = parseFloat(this.joistSpacing.value) || 16;
        const thickness = parseFloat(this.materialThickness.value) || 0.75;

        // Calculate fasteners based on standard spacing
        // 6" on perimeter, 8-12" in field depending on thickness
        const perimeterSpacing = 6; // inches
        const fieldSpacing = thickness >= 0.75 ? 12 : 8; // inches

        // Estimate based on room area (simplified calculation)
        // More accurate would require actual room dimensions and layout
        const approximateFasteners = Math.ceil(areaSquareFeet * 1.5); // Rough estimate

        return approximateFasteners;
    }

    updateResults(results) {
        document.getElementById('room-area').textContent = `${results.roomAreaSqFt} sq ft`;
        document.getElementById('sheets-needed').textContent = `${results.baseSheetsNeeded} sheets`;
        document.getElementById('sheets-with-waste').textContent = `${results.sheetsWithWaste} sheets`;
        document.getElementById('fasteners-needed').textContent = results.fastenersNeeded;
        document.getElementById('adhesive-tubes').textContent = `${results.adhesiveTubes} tubes`;
        document.getElementById('total-cost').textContent = `$${results.totalCost}`;

        // Show cost breakdown if any costs are entered
        if (parseFloat(results.materialCost) > 0 || parseFloat(results.laborTotal) > 0) {
            document.getElementById('material-cost').textContent = `$${results.materialCost}`;
            document.getElementById('fastener-cost-total').textContent = `$${results.fastenerCost}`;
            document.getElementById('underlayment-total').textContent = `$${results.underlaymentTotal}`;
            document.getElementById('labor-total').textContent = `$${results.laborTotal}`;
            document.getElementById('cost-breakdown').style.display = 'block';
        } else {
            document.getElementById('cost-breakdown').style.display = 'none';
        }
    }

    clear() {
        // Clear all inputs except defaults
        [this.roomLength, this.roomWidth, this.sheetPrice, this.fastenerPrice,
         this.underlaymentPrice, this.laborCost].forEach(input => {
            input.value = '';
        });

        // Reset to defaults
        this.materialType.value = 'plywood';
        this.materialThickness.value = '0.75';
        this.sheetSize.value = '4x8';
        this.joistSpacing.value = '16';
        this.fastenerType.value = 'screws';
        this.wasteFactor.value = '10';
        this.underlaymentType.value = 'foam';

        // Clear results
        document.getElementById('room-area').textContent = '0 sq ft';
        document.getElementById('sheets-needed').textContent = '0 sheets';
        document.getElementById('sheets-with-waste').textContent = '0 sheets';
        document.getElementById('fasteners-needed').textContent = '0';
        document.getElementById('adhesive-tubes').textContent = '0 tubes';
        document.getElementById('total-cost').textContent = '$0.00';
        document.getElementById('cost-breakdown').style.display = 'none';

        this.roomLength.focus();
    }

    showError(message) {
        console.error(message);
    }
}

// Subfloor material pricing guide (national averages)
const subfloorPricing = {
    'plywood': {
        '0.5': { price: 35, description: '½" CDX Plywood' },
        '0.625': { price: 42, description: '⅝" CDX Plywood' },
        '0.75': { price: 48, description: '¾" CDX Plywood' },
        '1.125': { price: 65, description: '1⅛" CDX Plywood' }
    },
    'osb': {
        '0.5': { price: 25, description: '½" OSB' },
        '0.625': { price: 30, description: '⅝" OSB' },
        '0.75': { price: 35, description: '¾" OSB' },
        '1.125': { price: 48, description: '1⅛" OSB' }
    },
    'advantech': {
        '0.625': { price: 55, description: '⅝" AdvanTech' },
        '0.75': { price: 62, description: '¾" AdvanTech' },
        '1.125': { price: 78, description: '1⅛" AdvanTech' }
    }
};

// Fastener requirements by material thickness
const fastenerRequirements = {
    '0.5': {
        screws: { length: '1.25', quantity: 1.2 },
        nails: { length: '1.5', quantity: 1.5 }
    },
    '0.625': {
        screws: { length: '1.25', quantity: 1.3 },
        nails: { length: '1.75', quantity: 1.6 }
    },
    '0.75': {
        screws: { length: '1.5', quantity: 1.4 },
        nails: { length: '2', quantity: 1.7 }
    },
    '1.125': {
        screws: { length: '2', quantity: 1.6 },
        nails: { length: '2.5', quantity: 2.0 }
    }
};

// Underlayment options and coverage
const underlaymentOptions = {
    'foam': {
        coverage: 100, // sq ft per roll
        cost_range: { min: 0.35, max: 0.65 },
        description: 'Basic foam padding'
    },
    'cork': {
        coverage: 200,
        cost_range: { min: 1.20, max: 2.50 },
        description: 'Natural cork underlayment'
    },
    'rubber': {
        coverage: 100,
        cost_range: { min: 0.80, max: 1.50 },
        description: 'Recycled rubber padding'
    },
    'felt': {
        coverage: 500,
        cost_range: { min: 0.15, max: 0.35 },
        description: 'Felt paper moisture barrier'
    }
};

// Joist spacing requirements
const joistSpacingRequirements = {
    '12': { min_thickness: 0.5, recommended: 0.625 },
    '16': { min_thickness: 0.625, recommended: 0.75 },
    '19.2': { min_thickness: 0.75, recommended: 1.125 },
    '24': { min_thickness: 1.125, recommended: 1.125 }
};

// Utility functions
function validateThicknessForSpacing(thickness, spacing) {
    const requirements = joistSpacingRequirements[spacing.toString()];
    if (!requirements) return true;

    return thickness >= requirements.min_thickness;
}

function calculateDeflection(thickness, spacing, load = 40) {
    // Simplified deflection calculation (PSF loading)
    // Real calculation would need material properties
    const span = spacing / 12; // Convert to feet
    const momentOfInertia = Math.pow(thickness, 3) / 12;

    // This is a simplified approximation
    return (5 * load * Math.pow(span, 4)) / (384 * 1600000 * momentOfInertia);
}

function estimateInstallationTime(squareFeet, complexity = 'normal') {
    const baseRate = {
        'simple': 25, // sq ft per hour
        'normal': 20,
        'complex': 15
    };

    return Math.ceil(squareFeet / (baseRate[complexity] || 20));
}

function calculateAdhesiveNeeded(squareFeet) {
    // Construction adhesive coverage: ~300 sq ft per 28oz tube
    return Math.ceil(squareFeet / 300);
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    new SubfloorCalculator();
    console.log('Subfloor Calculator initialized');
});

// Export for testing
// SubfloorCalculator is already initialized above
