// Simple test to see if basic functionality works
console.log('Simple test script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting simple test');
    
    // Test 1: Check if elements exist
    const roomLength = document.getElementById('room-length');
    const roomWidth = document.getElementById('room-width');
    const roomArea = document.getElementById('room-area');
    
    console.log('Elements found:', {
        roomLength: !!roomLength,
        roomWidth: !!roomWidth,
        roomArea: !!roomArea
    });
    
    if (roomLength && roomWidth && roomArea) {
        console.log('All elements found, adding test listener');
        
        // Test 2: Add simple calculation
        const calculate = () => {
            const length = parseFloat(roomLength.value) || 0;
            const width = parseFloat(roomWidth.value) || 0;
            const area = length * width;
            
            console.log('Calculating:', { length, width, area });
            roomArea.textContent = area.toFixed(2) + ' sq ft';
        };
        
        roomLength.addEventListener('input', calculate);
        roomWidth.addEventListener('input', calculate);
        
        // Test 3: Set initial values
        roomLength.value = '10';
        roomWidth.value = '12';
        calculate();
        
        console.log('Simple test setup complete');
    } else {
        console.error('Required elements not found');
    }
});
