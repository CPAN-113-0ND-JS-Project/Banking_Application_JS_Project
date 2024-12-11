const prompt = require("prompt-sync")({sigint: true})

function loadData() {
    var userData = JSON.parse(users.json)
    alert(userData[0])
}

function saveData() {
    
}

function handleUserInput() {

    var promptDecide = parseInt(prompt("Choose a number from 1-7: ")) 
    
    switch (promptDecide) {
        case 1:
            console.log("Withdrawing funds...")
            loadData()
        case 2:
            console.log("Depositing funds...")
            break;
        case 3:
            console.log("Viewing your account's balance...")
            break;
        case 4:
            console.log("You have chose to potentially send money to someone...")
            break;
        case 5:
            console.log("Checking if anyone has sent money to your bank account...")
            break;
        case 6:
            console.log("You chose to change your account's PIN...")

        case 7:
            console.log("Exiting menu...")
            break;

        default:
            console.error("Invalid input. Please enter a number from 1-7.")
            mainMenu();
    }
}

function mainMenu() {

    let state_of_menu = "opened"

    while (state_of_menu == "opened") {

        state_of_menu = "closed"

        console.log("-= Main Menu =-")
        console.log()
        console.log("1. Withdraw Funds");
        console.log("2. Deposit Funds");
        console.log("3. View Balance");
        console.log("4. Send E-Transfer");
        console.log("5. Accept E-Transfer");
        console.log("6. Change PIN");
        console.log("7. Exit");
        console.log()

        handleUserInput();
        
    };
};


mainMenu();