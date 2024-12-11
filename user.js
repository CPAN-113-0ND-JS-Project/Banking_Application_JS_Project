class User {
    constructor(email, pin, balance = 0) {
        this.email = email;
        this.pin = pin;
        this.balance = balance;
        this.failedAttempts = 0;
        this.locked = false;
    }

    authenticate(pin) {
        if (this.locked) {
            console.log('This account is locked due to too many failed attempts.');
            return false;
        }
        if (this.pin === pin) {
            this.failedAttempts = 0; // Reset failed attempts on successful login
            return true;
        }
        this.failedAttempts++;
        if (this.failedAttempts >= 10) {
            this.locked = true;
            console.log('Too many failed attempts. Your account is now locked.');
        }
        return false;
    }

    viewBalance() {
        return this.balance;
    }

    deposit(amount) {
        if (amount <= 0) {
            console.log('Deposit amount must be positive.');
            return false;
        }
        this.balance += amount;
        return true;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            console.log('Insufficient funds.');
            return false;
        }
        if (amount <= 0) {
            console.log('Withdrawal amount must be positive.');
            return false;
        }
        this.balance -= amount;
        return true;
    }
}

module.exports = User;
