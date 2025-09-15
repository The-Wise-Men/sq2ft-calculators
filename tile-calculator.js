// Tile Calculator - Simple Working Version
console.log('Tile calculator script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tile calculator');
    
    // Get input elements
    const roomLength = document.getElementById('room-length');
    const roomWidth = document.getElementById('room-width');
    const tileLength = document.getElementById('tile-length');
    const tileWidth = document.getElementById('tile-width');
    const wasteFactor = document.getElementById('waste-factor');
    const tilePrice = document.getElementById('tile-price');
    
    // Get result elements
    const roomArea = document.getElementById('room-area');
    const tilesNeeded = document.getElementById('tiles-needed');
    const tilesWithWaste = document.getElementById('tiles-with-waste');
    const estimatedCost = document.getElementById('estimated-cost');
    
    console.log('Elements found:', {
        roomLength: !!roomLength,
        roomWidth: !!roomWidth,
        tileLength: !!tileLength,
        tileWidth: !!tileWidth,
        roomArea: !!roomArea,
        tilesNeeded: !!tilesNeeded
    });
    
    // Calculate function
    function calculate() {
        console.log('Calculate function called');
        
        const length = parseFloat(roomLength.value) || 0;
        const width = parseFloat(roomWidth.value) || 0;
        const tileL = parseFloat(tileLength.value) || 0;
        const tileW = parseFloat(tileWidth.value) || 0;
        const waste = parseFloat(wasteFactor.value) || 10;
        const price = parseFloat(tilePrice.value) || 0;
        
        console.log('Values:', { length, width, tileL, tileW, waste, price });
        
        if (length > 0 && width > 0 && tileL > 0 && tileW > 0) {
            const area = length * width;
            const tileArea = (tileL * tileW) / 144; // Convert to square feet
            const baseTiles = Math.ceil(area / tileArea);
            const tilesWithWasteCount = Math.ceil(baseTiles * (1 + waste / 100));
            const cost = tilesWithWasteCount * price;
            
            console.log('Calculated:', { area, baseTiles, tilesWithWasteCount, cost });
            
            // Update results
            if (roomArea) roomArea.textContent = area.toFixed(2) + ' sq ft';
            if (tilesNeeded) tilesNeeded.textContent = baseTiles + ' tiles';
            if (tilesWithWaste) tilesWithWaste.textContent = tilesWithWasteCount + ' tiles';
            if (estimatedCost) estimatedCost.textContent = '$' + cost.toFixed(2);
            
            console.log('Results updated');
        } else {
            console.log('Invalid input values');
        }
    }
    
    // Add event listeners
    if (roomLength) {
        roomLength.addEventListener('input', calculate);
        console.log('Added listener to room length');
    }
    if (roomWidth) {
        roomWidth.addEventListener('input', calculate);
        console.log('Added listener to room width');
    }
    if (tileLength) {
        tileLength.addEventListener('input', calculate);
        console.log('Added listener to tile length');
    }
    if (tileWidth) {
        tileWidth.addEventListener('input', calculate);
        console.log('Added listener to tile width');
    }
    if (wasteFactor) {
        wasteFactor.addEventListener('input', calculate);
        console.log('Added listener to waste factor');
    }
    if (tilePrice) {
        tilePrice.addEventListener('input', calculate);
        console.log('Added listener to tile price');
    }
    
    // Set default values and calculate
    if (roomLength) roomLength.value = '10';
    if (roomWidth) roomWidth.value = '12';
    if (tileLength) tileLength.value = '12';
    if (tileWidth) tileWidth.value = '12';
    if (wasteFactor) wasteFactor.value = '10';
    if (tilePrice) tilePrice.value = '2.50';
    
    calculate();
    
    console.log('Tile calculator initialization complete');
});