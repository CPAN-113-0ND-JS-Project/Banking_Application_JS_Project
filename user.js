const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');

class User {
    constructor(email, pin, balance = 0, failedAttemptsRow = 0, securityQuestions = [], transfers = []) {
        this.email = email;
        this.pin = pin;
        this.balance = balance;
        this.failedAttempts = 0;
        this.failedAttemptsRow = failedAttemptsRow;
        this.isLocked = false;
        this.securityQuestions = securityQuestions;
        this.transfers = transfers;
    }

    authenticate(pin) {
        if (this.failedAttemptsRow >= 10) {
            this.isLocked = true;
            console.error("User has failed too many times in a row... Locking user out.");
            return false;
        }

        if (this.isLocked) {
            console.error("Your account is locked due to too many failed attempts.");
            return false;
        }

        let attempts = 0;
        while (attempts < 3) {
            if (this.pin === pin) {
                this.failedAttempts = 0;
                console.log("Login successful.");
                return true;
            }

            this.failedAttempts += 1;
            console.log();

            if (this.failedAttempts >= 3) {
                this.failedAttemptsRow += 1;
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
        console.log(`Your account's balance is $${this.balance}`);
    }

    deposit() {
        let depositAmount = parseFloat(prompt("Deposit: $"));
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.error("Deposit amount must be a positive number.");
            return;
        }

        this.balance += depositAmount;
        console.log(`Successfully deposited $${depositAmount}. Your new balance is $${this.balance}`);
    }

    withdraw() {
        let withdrawAmount = parseFloat(prompt("Withdraw: $"));

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            console.error("Withdrawal amount must be a positive number.");
            return;
        }

        if (this.balance < withdrawAmount) {
            console.error(`Insufficient funds. Your current balance is $${this.balance}, but you tried to withdraw $${withdrawAmount}.`);
            return;
        }

        this.balance -= withdrawAmount;
        console.log(`Successfully withdrew $${withdrawAmount}. Your new balance is $${this.balance}`);
    }
}

module.exports = User;
