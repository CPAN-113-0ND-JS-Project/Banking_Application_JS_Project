const prompt = require('prompt-sync')({ sigint: true });

class User {
    constructor(email, pin, balance = 0, failedAttemptsRow = 0, saveData) {
        this.email = email;
        this.pin = pin;
        this.balance = balance;
        this.failedAttempts = 0;
        this.failedAttemptsRow = failedAttemptsRow;
        this.isLocked = false;
        this.saveData = saveData;
    }

    authenticate(pin) {

        if (this.failedAttemptsRow >= 10) {
            this.isLocked = true;
            this.saveData();
            console.error("User has failed too many times in a row... Locking user out.");
            return false;
        }

        if (this.isLocked) {
            console.log();
            console.error("Your account is locked due to too many failed attempts.");
            return false;
        }

        let attempts = 0;
        while (attempts < 3) {
            if (this.pin === pin) {
                this.failedAttempts = 0;
                console.log("Login successful.");
                this.saveData();
                return true;
            }

            this.failedAttempts += 1;
            console.log();

            if (this.failedAttempts >= 3) {
                this.failedAttemptsRow += 1;
                this.saveData(); 
                console.error("Too many failed attempts... Exiting user from application.");
                return false;
            }

            attempts++;
            if (attempts < 3) {
                pin = prompt("Incorrect PIN. Try again: ");
            }
        }

        return false;
    }

    viewBalance() {
        console.log();
        console.log(`Your account's balance is $${this.balance}`);
    }

    deposit() {
        let promptDepBal = parseFloat(prompt("Deposit: $"));
        
        if (isNaN(promptDepBal) || promptDepBal <= 0) {
            console.log();
            console.error("Deposit amount must be a positive number.");
            return;
        }

        this.balance += promptDepBal;
        console.log();
        console.log(`Successfully deposited $${promptDepBal}. Your new balance is $${this.balance}`);
    }

    withdraw() {
        let promptWithBal = parseFloat(prompt("Withdraw: $"));

        if (isNaN(promptWithBal) || promptWithBal <= 0) {
            console.log();
            console.error("Withdrawal amount must be a positive number.");
            return;
        }

        if (this.balance < promptWithBal) {
            console.log();
            console.error(`Insufficient funds. Your current balance is $${this.balance}, but you tried to withdraw $${promptWithBal}.`);
            return;
        }

        this.balance -= promptWithBal;
        console.log();
        console.log(`Successfully withdrew $${promptWithBal}. Your new balance is $${this.balance}`);
    }
}

module.exports = User;
