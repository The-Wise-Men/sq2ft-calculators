// Simple test calculator - guaranteed to work
console.log('Test calculator script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting simple test');
    
    // Find the room area element
    const roomAreaElement = document.getElementById('room-area');
    console.log('Room area element found:', !!roomAreaElement);
    
    if (roomAreaElement) {
        // Set a test value
        roomAreaElement.textContent = '120 sq ft';
        console.log('Set test value to room area');
        
        // Find input elements and add listeners
        const roomLength = document.getElementById('room-length');
        const roomWidth = document.getElementById('room-width');
        
        console.log('Input elements found:', {
            roomLength: !!roomLength,
            roomWidth: !!roomWidth
        });
        
        if (roomLength && roomWidth) {
            const calculate = function() {
                const length = parseFloat(roomLength.value) || 0;
                const width = parseFloat(roomWidth.value) || 0;
                const area = length * width;
                
                console.log('Calculating:', { length, width, area });
                roomAreaElement.textContent = area.toFixed(2) + ' sq ft';
            };
            
            roomLength.addEventListener('input', calculate);
            roomWidth.addEventListener('input', calculate);
            
            // Set test values
            roomLength.value = '10';
            roomWidth.value = '12';
            calculate();
            
            console.log('Simple test setup complete');
        }
    } else {
        console.log('Room area element not found');
    }
});
