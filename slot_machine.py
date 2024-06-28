import random

# Define the symbols that will appear on the slot machine reels
symbols = ['Drikk', 'Brage', 'Sindre', 'Gi vekk', 'Erik', 'ta mer']

number = 0

# Function to spin the reels and create a 3x3 grid
def spin_reels():
    return [[random.choice(symbols) for _ in range(3)] for _ in range(3)]

# Function to check if the player has won
def check_win(grid):

    
    for i in range(3):
        j = i+1
        # Check rows and columns
        if grid[i][0] == grid[i][1] == grid[i][2]:
            return 10
        if grid[0][i] == grid[1][i] == grid[2][i]:
            return 10
        
        if grid[i][0] == grid[i][1] == grid[i][2] and grid[j][0] == grid[j][1] == grid[j][2]:
            return 11
        if grid[0][i] == grid[1][i] == grid[2][i] and grid[0][j] == grid[1][j] == grid[2][j]:
            return 11
        
    # Check diagonals
    # Top-left to bottom-right
    if grid[0][0] == grid[1][1] == grid[2][2]:
        return 9
    # Top-right to bottom-left
    if grid[0][2] == grid[1][1] == grid[2][0]:
        return 9  

    # Check diagonals
    if grid[0][0] == grid[1][1] == grid[2][2]:
        return 8
    if grid[0][2] == grid[1][1] == grid[2][0]:
        return 8
    

    


    return False

# Main game loop
def slot_machine_game():
    print("velkommen til et morsomt spill")
    balance = number
    cost_per_spin = 20
    
    while True:
        print(f"\n Balance: {balance}")
        play = input("trykk Enter for å rulle (eller skriv 'slutt eller quit' for å si deg ferdig): ").strip().lower()
        
        if play == 'quit' or play == 'slutt':
            slutt_resultat = round((balance + cost_per_spin) / 100 ) 
            if slutt_resultat > 0:
                print(f"du kan få lov å gi vekk: {slutt_resultat} slurk/er")
            else:
                print(f"Du prøvde endelig drikk: {slutt_resultat} slurk/er")
            break
        
        
        balance -= cost_per_spin
        grid = spin_reels()
        
        # Print the 3x3 grid
        print("ruller...")
        for row in grid:
            print(" | ".join(row))
        
        if check_win(grid) >= 11:
            print("bra jobba!")
            balance += 300  # Award for winning
        if check_win(grid) >= 10:
            print("woohoo, hverfall en")
            balance += 100  # Award for winning
        elif check_win(grid) >= 9:
            print("halveis")
            balance += 50  # Award for winning
        elif check_win(grid) >= 8:
            print ("ish")
            balance += 25   # Award for winning
        else:
            print("-------------")
            print("Beklager, en gang til?")
            #begynner på nytt
        print(f"Drikke:{balance}")


slot_machine_game()
