const prompt = require('prompt-sync')({ sigint: true });

class User {
    constructor(email, pin, balance = 0) {
        this.email = email; 
        this.pin = pin;
        this.balance = balance;
        this.failedAttempts = 0;
        this.isLocked = false;
    }

    authenticate(pin) {

        if (this.isLocked) {
            console.log();
            console.error("Your account is locked due to too many failed attempts.");
            return false;
        }

        if (this.pin !== pin) {
            this.failedAttempts += 1;
            console.log();
            if (this.failedAttempts >= 10) {
                this.isLocked = true; 
                console.log();
                console.error("Too many failed attempts has been attempted... Locking user out.")
            }
            return false;
        }

        this.failedAttempts = 0;
        return true;
    }

    viewBalance() {

        console.log();
        console.log(`Your account's balance is $${this.balance}`);

    }

    deposit() {

        var promptDepBal = parseInt(prompt("Deposit: $"))

        if (promptDepBal <= 0) {
            console.log();
            console.error("Deposit amount must be above $0.");
            return;
        }
        this.balance += promptDepBal;
        console.log();
        console.log(`Successfully deposited $${promptDepBal}. Your new balance is $${this.balance}`);
    }

    withdraw() {

        var promptWithBal = parseInt(prompt("Withdraw: $"))

        if (promptWithBal <= 0) {
            console.log();
            console.error("Withdrawal amount must be above $0.");
            return;
        }
        if (this.balance < promptWithBal) {
            console.log();
            console.error(`Your account's balance has insufficient funds to withdraw $${promptWithBal}.`);
            return;
        }
        this.balance -= promptWithBal;
        console.log();
        console.log(`Successfully withdrew $${promptWithBal}. Your new balance is $${this.balance}`);
    }
    
}

module.exports = User;
