const slots = [
    [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')],
    [document.getElementById('slot4'), document.getElementById('slot5'), document.getElementById('slot6')],
    [document.getElementById('slot7'), document.getElementById('slot8'), document.getElementById('slot9')]
];

const result = document.getElementById('result');
const spinButton = document.getElementById('spinButton');
const doneButton = document.getElementById('doneButton');
const balanceElement = document.getElementById('balance');
const lastWinElement = document.getElementById('lastWin');

const symbols = [
    '../pictures/brage_bilde.jpg',
    '../pictures/Brage_underbukse.jpg',
    '../pictures/emil_bilde.jpg',
    '../pictures/emilie_bilde.PNG',
    '../pictures/erik_bilde.PNG',
    '../pictures/gustav_bilde.PNG',
    '../pictures/joey_bilde.PNG',
    '../pictures/jonas_emil_buss.png',
    '../pictures/jonas_skki.PNG',
    '../pictures/lars_bilde.PNG',
    '../pictures/sedric_båt_kveld.jpg',
    '../pictures/sedric_bilde.jpg',
    '../pictures/sindre_bilde.jpg',
    '../pictures/svavar_bilde.jpg',
    '../pictures/teselskap_julebord_bilde.jpg'
];

const spinCost = 25;
const winRewards = { 3: 300, 4: 600, 5: 1500 };
let balance = 0;
let lastWin = 0;

// Initial message
result.textContent = 'Good Luck';

// Set initial images for slots
const slotImages = document.querySelectorAll('.slots .slot img');
slotImages.forEach(img => {
    img.src = symbols[Math.floor(Math.random() * symbols.length)];
});

spinButton.addEventListener('click', async () => {
    balance -= spinCost;
    updateBalance();

    const results = [];
    const rollPromises = [];

    // Roll each slot
    for (let i = 0; i < slots.length; i++) {
        const row = slots[i];
        for (let j = 0; j < row.length; j++) {
            const slot = row[j];
            const img = slot.querySelector('img');
            rollPromises.push(rollSlot(img));
            const randomSymbol = getRandomSymbol();
            results.push(randomSymbol);
        }
    }

    await Promise.all(rollPromises);

    setTimeout(() => {
        const winCount = checkWin(results);
        if (winCount >= 3) {
            lastWin = winRewards[winCount];
            balance += lastWin;
            result.textContent = `You Win! ${lastWin}`;
            result.style.color = 'green';
            result.style.border = '2px solid green'; // Add green border for win
        } else {
            lastWin = 0;
            result.textContent = 'Try Again!';
            result.style.color = 'red';
            result.style.border = 'none'; // Remove border if no win
        }
        updateBalance();
    }, 1100); // Adjust the delay to match the animation duration
});

doneButton.addEventListener('click', () => {
    const finished_balance = Math.ceil(balance / 1000);

    const max = Math.floor(finished_balance);
    const min = Math.ceil(finished_balance);
    if (balance < 0) {
        alert("Du må drikke " + min + " slurker");
    } else {
        alert("Du kan gi vekk " + -max + " slurker");
    }
});

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function rollSlot(img) {
    return new Promise(resolve => {
        img.style.transition = 'none'; // Disable transition temporarily
        img.style.transform = 'translateY(-100%)'; // Move image to the top
        setTimeout(() => {
            img.src = getRandomSymbol(); // Change image source while off-screen
            img.style.transition = 'transform 0.5s cubic-bezier(0.5, 0, 0.5, 1)'; // Re-enable transition with rolling effect
            img.style.transform = 'translateY(0)'; // Roll down to reveal the new symbol
            resolve();
        }, 100); // Delay before changing source and rolling down
    });
}

function checkWin(results) {
    const winPatterns = [
        // Horizontal patterns
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // Vertical patterns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // Diagonal patterns
        [0, 4, 8],
        [2, 4, 6]
    ];

    let maxCount = 0;

    // Check each win pattern
    winPatterns.forEach(pattern => {
        let count = 1; // Start count at 1 (since we're checking from the second symbol onward)

        // Iterate through the pattern to check for consecutive matching symbols
        for (let i = 1; i < pattern.length; i++) {
            const prevIndex = pattern[i - 1];
            const currentIndex = pattern[i];

            // If symbols match, increase count
            if (results[prevIndex] === results[currentIndex]) {
                count++;

                // Update maxCount if current count is greater
                if (count > maxCount) {
                    maxCount = count;
                }
            } else {
                count = 1; // Reset count if symbols don't match
            }
        }
    });

    return maxCount;
}

function updateBalance() {
    balanceElement.textContent = `Balance: ${balance}`;
    lastWinElement.textContent = `Last Win: ${lastWin}`;
}
