const slots = [
    [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ],
    [
        document.getElementById('slot4'),
        document.getElementById('slot5'),
        document.getElementById('slot6')
    ],
    [
        document.getElementById('slot7'),
        document.getElementById('slot8'),
        document.getElementById('slot9')
    ],
    [
        document.getElementById('slot10'),
        document.getElementById('slot11'),
        document.getElementById('slot12')
    ],
    [
        document.getElementById('slot13'),
        document.getElementById('slot14'),
        document.getElementById('slot15')
    ]
];

const result = document.getElementById('result');
const spinButton = document.getElementById('spinButton');
const doneButton = document.getElementById('doneButton');
const balanceElement = document.getElementById('balance');

const symbols = [
    '../pictures/Lars bilde 1.PNG',
    '../pictures/Lars bilde 2.PNG',
    '../pictures/Lars bilde 3.PNG',
    '../pictures/Lars bilde 4.PNG',
    '../pictures/Lars bilde 5.PNG',
    '../',
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

const spinCost = 30;
const winRewards = { 3: 450, 4: 1000, 5: 2700 };
let balance = 0;

// Initial message
result.textContent = 'Good Luck';

// Set initial images for slots
const slotImages = document.querySelectorAll('.slots .slot img');
slotImages.forEach(img => {
    img.src = '../pictures/default_image.jpg'; // Replace with your initial/default image path
});

// Event listener for spin button
spinButton.addEventListener('click', async () => {
    balance -= spinCost;
    updateBalance();
    result.textContent = "8==D --- ()";
    result.style.color = 'black';

    const results = [];
    const rollPromises = [];

    // Roll each row sequentially
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

        // Wait for the entire row to finish rolling before proceeding
        await Promise.all(rollPromises.slice(-row.length));
    }

    setTimeout(() => {
        const winCount = checkWin(results);
        if (winCount >= 3) {
            balance += winRewards[winCount];
            result.textContent = `You Win! ${winRewards[winCount]}`;
            result.style.color = 'green';
            result.style.border = '2px solid green'; // Add green border for win
        } else {
            result.textContent = 'Try Again!';
            result.style.color = 'red';
            result.style.border = 'none'; // Remove border if no win
        }
        updateBalance();
    }, 1100); // Adjust the delay to match the animation duration
});

// Event listener for done button
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
            img.style.transition = 'transform 1s cubic-bezier(0.5, 0, 0.5, 1)'; // Re-enable transition with rolling effect
            img.style.transform = 'translateY(0)'; // Roll down to reveal the new symbol
            resolve();
        }, 100); // Delay before changing source and rolling down
    });
}

function checkWin(results) {
    const winPatterns = [
        // Horizontal patterns for 3, 4, and 5 symbols in a row
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 4],
        [5, 6, 7],
        [6, 7, 8],
        [7, 8, 9],
        [10, 11, 12],
        [11, 12, 13],
        [12, 13, 14],

        // Vertical patterns for 3, 4, and 5 symbols in a column
        [0, 5, 10],
        [1, 6, 11],
        [2, 7, 12],
        [3, 8, 13],
        [4, 9, 14],
        [5, 10, 15],
        [6, 11, 16],
        [7, 12, 17],
        [8, 13, 18],
        [9, 14, 19],
        [10, 15, 20],
        [11, 16, 21],
        [12, 17, 22],
        [13, 18, 23],
        [14, 19, 24],

        // Diagonal patterns for 3, 4, and 5 symbols diagonally
        [0, 6, 12],
        [1, 7, 13],
        [2, 8, 14],
        [3, 7, 11],
        [4, 8, 12],
        [5, 9, 13],
        [6, 12, 18],
        [7, 13, 19],
        [8, 14, 20],
        [9, 13, 17],
        [10, 14, 18],
        [11, 15, 19],
        [12, 18, 24],
        [13, 19, 23],
        [14, 20, 24],
        [4, 8, 12, 16],
        [0, 6, 12, 18],
        [1, 7, 13, 19],
        [2, 8, 14, 20],
        [3, 7, 11, 15],
        [4, 8, 12, 16],
        [5, 9, 13, 17],
        [6, 12, 18, 24],
        [7, 13, 19, 23],
        [8, 14, 20, 24]
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
                // Reset count if symbols don't match
                count = 1;
            }
        }
    });

    return maxCount;
}

function updateBalance() {
    balanceElement.textContent = `Balance: ${balance}`;
}
