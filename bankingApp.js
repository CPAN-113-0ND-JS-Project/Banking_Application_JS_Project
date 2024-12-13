const fs = require('fs');
const User = require('./user');
const Etransfer = require('./etransfer');
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
                u => new User(u.email, u.pin, u.balance, u.failedAttemptsRow, u.securityQuestions, u.transfers, this.saveData.bind(this))
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
                isLocked: u.isLocked,
                securityQuestions: u.securityQuestions,
                transfers: u.transfers
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
            case 4:
                const recipientEmail = prompt("Enter recipient's email: ");
                const amount = parseFloat(prompt("Enter amount to send: $"));
                const securityQuestion = prompt("Enter a security question: ");
                const securityQuestionAnswer = prompt("Enter the answer to the security question: ");
                
                const transfer = new Etransfer(this.currentUser.email, recipientEmail, amount, securityQuestion, securityQuestionAnswer);
                const transferSuccess = transfer.sendETransfer(this.currentUser);
                
                if (transferSuccess) {
                    console.log("E-transfer sent successfully.");
                } else {
                    console.log("E-transfer failed.");
                }
                break;
            case 5:
                if (this.currentUser) {
                    const transferInstance = new Etransfer();
                    const acceptSuccess = transferInstance.acceptETransfer(this.currentUser);
                    
                    if (!acceptSuccess) {
                        console.log("No pending transfers or failed to accept transfer.");
                    }
                } else {
                    console.log("No current user to accept transfers.");
                }
                break;
            case 6:
                this.changePin();
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
    }

    changePin() {
        const newPin = prompt("Enter new PIN: ");
        if (this.currentUser) {
            this.currentUser.pin = newPin;
            this.saveData();
            console.log("PIN successfully changed.");
        } else {
            console.log("No current user to change PIN.");
        }
    }

    start() {
        const email = prompt("Enter email: ");
        const pin = prompt("Enter PIN: ");

        let user = this.users.find(u => u.email === email);

        if (!user) {
            console.log("Email not found. Creating a new account...");
            const securityQuestion = prompt("Set a security question: ");
            const securityQuestionAnswer = prompt("Set an answer to the security question: ");
            user = new User(email, pin, 0, 0, [securityQuestion], [], this.saveData.bind(this));
            this.users.push(user);
            this.saveData();
        }

        this.currentUser = user;
        let exit = false;
        while (!exit) {
            this.mainMenu();
            this.handleUserInput();
        }
    }
}

module.exports = BankingApp;
