const fs = require('fs');

class Etransfer {
    constructor(sender, recipent, amount, securityQuestion, securityQuestionAnswer) {
        this.sender = sender;
        this.recipent = recipent;
        this.amount = amount;
        this.securityQuestion = securityQuestion;
        this.securityQuestionAnswer = securityQuestionAnswer;
    }
       // Method to send E-transfer
    sendETransfer(user) {
        if (user.balance >= this.amount) {
            user.balance -= this.amount;
            const tranfer = {
                sender: this.sender,
                recipent: this.recipent,
                amount: this.amount,
                securityQuestion: this.securityQuestion,
                securityQuestionAnswer: this.securityQuestionAnswer

            };

            let data = [];
            try {
                data = JSON.parse(fs.readFileSync('transfer.json', 'utf8'));
            } catch (error) {
                console.log('No existing transfer data found');
            }
            
            data.push(tranfer);
            fs.writeFileSync('transfer,JSON', JSON.stringify(data, null));

            console.log(`E-Transfer of $${this.amount} transfered to ${this.recipent}.`);
             return true
            } else {
                console.log("Insuffent Funds");
                return false;
            }
    }
}