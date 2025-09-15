// Simple test calculator
console.log('Test calculator script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing test calculator');
    
    const roomLength = document.getElementById('room-length');
    const roomWidth = document.getElementById('room-width');
    
    console.log('Input elements:', {
        roomLength: !!roomLength,
        roomWidth: !!roomWidth
    });
    
    if (roomLength && roomWidth) {
        console.log('Adding test listeners');
        
        roomLength.addEventListener('input', () => {
            console.log('Room length changed:', roomLength.value);
        });
        
        roomWidth.addEventListener('input', () => {
            console.log('Room width changed:', roomWidth.value);
        });
        
        console.log('Test listeners added successfully');
    } else {
        console.log('Input elements not found');
    }
});
