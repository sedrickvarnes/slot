import random

# Define the symbols that will appear on the slot machine reels
symbols = ['Cherry', 'Lemon', 'Orange', 'Plum', 'Bell', 'Bar']

# Function to spin the reels
def spin_reels():
    return [random.choice(symbols) for _ in range(3)]

# Function to check if the player has won
def check_win(reels):
    if reels[0] == reels[1] == reels[2]:
        return True
    return False

# Main game loop
def slot_machine_game():
    print("Welcome to the Slot Machine Game!")
    balance = 100  # Starting balance
    cost_per_spin = 10
    
    while True:
        print(f"\nYour current balance is: ${balance}")
        play = input("Press Enter to spin (or type 'quit' to exit): ").strip().lower()
        
        if play == 'quit':
            print("Thank you for playing! Goodbye.")
            break
        
        if balance < cost_per_spin:
            print("You don't have enough balance to spin. Game over.")
            break
        
        balance -= cost_per_spin
        reels = spin_reels()
        print("Spinning... ", " | ".join(reels))
        
        if check_win(reels):
            print("Congratulations! You've won!")
            balance += 50  # Award for winning
        else:
            print("Sorry, you didn't win this time.")
        
        print(f"Your balance is now: ${balance}")

# Run the slot machine game
slot_machine_game()
