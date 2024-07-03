// JavaScript for a 5x3 Slot Machine Game

// Define constants and variables
const slots = [
    [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3'), document.getElementById('slot4'), document.getElementById('slot5')],
    [document.getElementById('slot6'), document.getElementById('slot7'), document.getElementById('slot8'), document.getElementById('slot9'), document.getElementById('slot10')],
    [document.getElementById('slot11'), document.getElementById('slot12'), document.getElementById('slot13'), document.getElementById('slot14'), document.getElementById('slot15')]
];

const result = document.getElementById('result');
const spinButton = document.getElementById('spinButton');
const doneButton = document.getElementById('doneButton');
const balanceElement = document.getElementById('balance');
const lastWinElement = document.getElementById('lastWin');

const symbols = [
    '../Lars_bilder/Lars bilde 1.PNG',
    '../Lars_bilder/Lars bilde 2.PNG',
    '../Lars_bilder/Lars bilde 3.PNG',
    '../Lars_bilder/Lars bilde 4.PNG',
    '../Lars_bilder/Lars bilde 5.PNG',
    '../Lars_bilder/sindre 1.jpg',
    '../Lars_bilder/sindre 2.jpg',
    '../Lars_bilder/sindre 5.png',
    '../Lars_bilder/sindre 4.jpg',
];

const spinCost = 50;
const winRewards = { 3: 900, 4: 1500, 5: 3000 };

let balance = 0;
let lastWin = 0;

// Initial message
result.textContent = 'Good Luck!';

// Event listener for spin button click
spinButton.addEventListener('click', async () => {
    // Deduct spin cost from balance
    balance -= spinCost;
    updateBalance();

    const results = [];
    const rollPromises = [];

    // Roll each slot in sequence
    for (let i = 0; i < slots.length; i++) {
        const row = slots[i];
        const rowResults = [];

        // Roll each slot in the row
        for (let j = 0; j < row.length; j++) {
            const slot = row[j];
            const img = slot.querySelector('img');
            rollPromises.push(rollSlot(img));
            const randomSymbol = getRandomSymbol();
            results.push(randomSymbol);
            rowResults.push(randomSymbol);
        }

        // Wait for the entire row to finish rolling before proceeding to the next row
        await Promise.all(rollPromises.slice(-row.length));
    }

    // Calculate win
    const { maxCount, winMultiplier } = checkWin(results);

    // Determine if there's a win
    if (maxCount >= 3) {
        const winAmount = winRewards[maxCount] * winMultiplier;
        balance += winAmount;
        lastWin = winAmount;
        result.textContent = `You Win!`;
        result.style.color = 'green';
    } else {
        result.textContent = 'Try Again!';
        result.style.color = 'red';
    }

    // Update UI elements
    updateBalance();
    updateLastWin();
});

// Function to roll a slot
function rollSlot(img) {
    return new Promise(resolve => {
        img.style.transition = 'none'; // Disable transition temporarily
        img.style.transform = 'translateY(-100%)'; // Move image to the top
        setTimeout(() => {
            img.src = getRandomSymbol(); // Change image source while off-screen
            img.style.transition = 'transform 1s cubic-bezier(0.5, 0, 0.5, 1)'; // Re-enable transition with rolling effect
            img.style.transform = 'translateY(0)'; // Roll down to reveal the new symbol
            resolve();
        }, 100); // Delay before changing source and rolling down
    });
}

// Function to get a random symbol
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}



doneButton.addEventListener('click', () => {
    // Add your logic here
    const finished_balance = Math.ceil(balance / 500);

    const max = Math.floor(finished_balance);
    const min = Math.max(Math.ceil(finished_balance),1);
    if (balance < 0) {
        alert("Du må drikke " + Math.max(min, 1) + " slurk/er");
    } else {
        alert("Du kan gi vekk " + max + " slurk/er");
    }
});

// Function to check for wins
function checkWin(results) {
    const winPatterns = [
        // Horizontal patterns
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],

        // Vertical patterns
        [0, 5, 10],
        [1, 6, 11],
        [2, 7, 12],
        [3, 8, 13],
        [4, 9, 14],

        // Diagonal patterns
        [0, 6, 12],
        [4, 8, 12],
        [1, 7, 13],
        [3, 7, 11],
    ];

    let maxCount = 0;
    let winMultiplier = 1; // Default multiplier for horizontal and vertical wins

    // Check each win pattern
    winPatterns.forEach(pattern => {
        // Check for 3 symbols in a row
        for (let i = 0; i <= pattern.length - 3; i++) {
            let count = 1; // Start count at 1 (since we're checking from the second symbol onward)

            // Iterate through the pattern to check for consecutive matching symbols
            for (let j = i + 1; j < pattern.length; j++) {
                if (results[pattern[j]] === results[pattern[j - 1]]) {
                    count++;

                    // Update maxCount if current count is greater
                    if (count > maxCount) {
                        maxCount = count;

                        // Adjust win multiplier for diagonal wins
                        if (pattern.length === 3) { // 3 symbols in the pattern
                            winMultiplier = 0.5; // Diagonal multiplier
                        } else {
                            winMultiplier = 1; // Horizontal or vertical multiplier
                        }
                    }

                    // Check for exactly 3 symbols in a row
                    if (count === 3 || count === 4 || count === 5) {
                        break; // No need to check further if already found a win
                    }
                } else {
                    break; // Break if symbols don't match consecutively
                }
            }
        }
    });

    return { maxCount, winMultiplier };
}

// Function to update balance on the UI
function updateBalance() {
    balanceElement.textContent = `Balance: ${balance}`;
}

// Function to update last win on the UI
function updateLastWin() {
    lastWinElement.textContent = `Last Win: ${lastWin}`;
}
