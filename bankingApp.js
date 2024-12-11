const fs = require('fs');
const User = require('./user');
const readline = require('readline');

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
            console.log('No previous data found. Starting fresh.');
        }
    }

    saveData() {
        const data = {
            users: this.users.map(u => ({
                email: u.email,
                pin: u.pin,
                balance: u.balance,
                failedAttempts: u.failedAttempts,
                locked: u.locked
            }))
        };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    }

    authenticateUser(email, pin) {
        let user = this.users.find(u => u.email === email);

        if (!user) {
            // Create a new user if email doesn't exist
            console.log('Email not found. Creating a new account...');
            user = new User(email, pin, 0); // New user starts with a 0 balance
            this.users.push(user);
            this.saveData();
            this.currentUser = user;
            return true;
        }

        if (user.authenticate(pin)) {
            this.currentUser = user;
            return true;
        }

        console.log('Incorrect PIN.');
        return false;
    }

    mainMenu() {
        console.log('\nMain Menu:');
        console.log('1. View Balance');
        console.log('2. Deposit Funds');
        console.log('3. Withdraw Funds');
        console.log('4. Exit');
    }

    handleUserInput(choice) {
        switch (choice) {
            case '1':
                console.log(`Your balance is: $${this.currentUser.viewBalance()}`);
                break;
            case '2':
                console.log('Enter amount to deposit:');
                break;
            case '3':
                console.log('Enter amount to withdraw:');
                break;
            case '4':
                console.log('Exiting...');
                this.saveData();
                process.exit(0);
            default:
                console.log('Invalid choice. Please try again.');
        }
    }

    async start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter email: ', email => {
            rl.question('Enter PIN: ', pin => {
                if (this.authenticateUser(email, pin)) {
                    console.log('Login successful!');
                    this.mainMenu();
                    rl.question('Enter your choice: ', choice => {
                        this.handleUserInput(choice);
                        rl.close();
                    });
                } else {
                    console.log('Invalid email or PIN.');
                    rl.close();
                }
            });
        });
    }
}

module.exports = BankingApp;
