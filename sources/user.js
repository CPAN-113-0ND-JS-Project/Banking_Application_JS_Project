const prompts = require('prompt-sync')

class User {
    constructor (user, pin, balance, attempts){
        this.user = []
        this.pin = []
        this.balance = []
        this.attempts = 0
    }
    authenticate(user, pin, attempts) {

        let locked = false

        if (attempts >= 3) {
            console.error("Too many attempts... User has been forcibly locked out of the app.")
            locked = true
        };

        if (!user) {
            console.error("Invalid user. Try again.")
        };
        
        if (locked == true) {

        }
    }

    viewBalance(user) {
        console.log(`Your balance is ${user.balance}`)
    };

    deposit(user) {

    };

    withdraw() {

    };
}

module.exports = User