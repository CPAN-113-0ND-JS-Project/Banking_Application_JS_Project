const fs = require('fs');
const User = require('./user');
const prompt = require('prompt-sync')({ sigint: true });

class BankingApp {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.loadData();
    }

    loadData() {
        try {
            const data = fs.readFileSync('data.json', 'utf8');
            const parsedData = JSON.parse(data);
            this.users = parsedData.users.map(
                u => new User(u.email, u.pin, u.balance)
            );
        } catch (error) {
            console.log("No previous data found. Starting fresh.");
        }
    }

    saveData() {
        const data = {
            users: this.users.map(u => ({
                email: u.email,
                pin: u.pin,
                balance: u.balance,
                failedAttempts: u.failedAttempts,
                locked: u.isLocked
            }))
        };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    }

    authenticateUser(email, pin) {
        let user = this.users.find(u => u.email === email);

        if (!user) {
            console.log("Email not found. Creating a new account...");
            user = new User(email, pin, 0); 
            this.users.push(user);
            this.saveData();
            this.currentUser = user;
            return true;
        }

        let attempts = 0

        while (attempts <= 3) {
            if (user.authenticate(pin)) {
                this.currentUser = user;
                return true;
            }
            attempts++;
            if (attempts <= 3) {
                pin = prompt("Incorrect PIN. Try again: "); 
            }
        }

        console.error("Too many failed attempts. Forcing user out.")

        if (attempts >= 10)  {
            console.error("Too many failed attempts has been attempted. Locking user out...")
            user.isLocked = true;
            this.saveData();
        }

        return false;
    }

    mainMenu() {
        console.log();
        console.log("   Main Menu:");
        console.log();
        console.log("1. Withdraw Funds");
        console.log("2. Deposit Funds");
        console.log("3. View Balance");
        console.log("4. Send E-Transfer");
        console.log("5. Accept E-Transfer");
        console.log("6. Change PIN");
        console.log("7. Exit");
        console.log();
    }

    handleUserInput() {

        var promptChoice = parseFloat(prompt("Enter a number from [1-7]: "))

        switch (promptChoice) {
            case 1: 
                this.currentUser.withdraw();
                break;
            case 2: 
                this.currentUser.deposit();
                break;
            case 3: 
                this.currentUser.viewBalance();
                break;
            case 4:
                break;
            case 5:
                break;
            case 6: 
                break;
            case 7:  
                console.log();
                console.log("Data has been changed and saved.")
                console.log("Exiting now...");
                this.saveData();
                process.exit(0);
                break;
            default:
                console.log();
                console.error("Invalid input. Please try again.");
                break;
        }

        this.mainMenu();
        this.handleUserInput();
    }

    async start() {
        const email = prompt("Enter email: ");
        const pin = prompt("Enter PIN: ");

        if (this.authenticateUser(email, pin)) {
            console.log("Login successful!");
            this.mainMenu();
            this.handleUserInput();
        }
    }
}

module.exports = BankingApp;
