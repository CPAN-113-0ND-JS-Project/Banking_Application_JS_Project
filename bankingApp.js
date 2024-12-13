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
                u => new User(u.email, u.pin, u.balance, u.failedAttemptsRow, this.saveData.bind(this))
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
                failedAttemptsRow: u.failedAttemptsRow,
                isLocked: u.isLocked
            }))
        };

        console.log("Saving data...");
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
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
        var promptChoice = parseFloat(prompt("Enter a number from [1-7]: "));
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
            case 7:  
                console.log("Thank you for using the application.");
                console.log("Exiting now...");
                this.saveData();
                process.exit(0);
            default:
                console.log("Invalid input. Please try again.");
                break;
        }
        this.mainMenu();
        this.handleUserInput();
    }

    start() {
        const email = prompt("Enter email: ");
        const pin = prompt("Enter PIN: ");

        let user = this.users.find(u => u.email === email);

        if (!user) {
            console.log("Email not found. Creating a new account...");
            user = new User(email, pin, 0, this.saveData.bind(this));
            this.users.push(user);
            this.saveData();
        }

        if (user.authenticate(pin)) {
            console.log("Login successful!");
            this.currentUser = user;
            this.mainMenu();
            this.handleUserInput();
        }

    }
}

module.exports = BankingApp;
