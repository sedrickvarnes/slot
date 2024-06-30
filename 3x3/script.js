const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3'),
    document.getElementById('slot4'),
    document.getElementById('slot5'),
    document.getElementById('slot6'),
    document.getElementById('slot7'),
    document.getElementById('slot8'),
    document.getElementById('slot9')
];
const result = document.getElementById('result');
const spinButton = document.getElementById('spinButton');
const balanceElement = document.getElementById('balance');

const symbols = [
    '../pictures/brage_bilde.jpg',
    '../pictures/emil_bilde.jpg',
    '../pictures/erik_bilde.PNG',
    '../pictures/gustav_bilde.PNG',
    '../pictures/joey_bilde.PNG',
    '../pictures/lars_bilde.PNG',
    '../pictures/sedric_bilde.jpg',
    '../pictures/sindre_bilde.jpg',
    '../pictures/svavar_bilde.jpg',

];
const spinCost = 100;
const winReward = 1100;
let balance = 0;

spinButton.addEventListener('click', () => {

    balance -= spinCost;
    updateBalance();

    const results = [];
    slots.forEach(slot => {
        slot.parentNode.classList.remove('winning');
        const randomSymbol = getRandomSymbol();
        slot.src = randomSymbol;
        results.push(randomSymbol);
    });

    if (checkWin(results)) {
        
        balance += winReward;
        result.textContent = 'You Win!';
        result.style.color = 'green';
    } else {
        result.textContent = 'Try Again!';
        result.style.color = 'red';
    }

    updateBalance();
});

doneButton.addEventListener('click', () => {
    finished_balance = Math.ceil(balance/1000)
    max = Math.floor(finished_balance) -1
    min = -Math.ceil(finished_balance)
    if (finished_balance < 0) {
        alert("Du må drikke " + min + " slurker")
    } else {
        alert("Du kan gi vekk " + max + " slurker")
    }
});


function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function checkWin(results) {
    const winningLines = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
        [0, 3, 6], // Column 1
        [1, 4, 7], // Column 2
        [2, 5, 8], // Column 3
        [0, 4, 8], // Diagonal 1
        [2, 4, 6]  // Diagonal 2
    ];
    for (const line of winningLines) {
        const [a, b, c] = line;
        if (results[a] === results[b] && results[b] === results[c]) {
    
            line.forEach(index => slots[index].parentNode.classList.add('winning'));
            return true;
        }
    }
    return false;
}

function updateBalance() {
    balanceElement.textContent = balance;
}