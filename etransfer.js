const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });

class Etransfer {
    constructor(sender, recipient, amount, securityQuestion, securityQuestionAnswer) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.securityQuestion = securityQuestion;
        this.securityQuestionAnswer = securityQuestionAnswer;
    }

    sendETransfer(user) {
        if (!user) {
            console.error("User object is not provided.");
            return false;
        }

        if (user.balance >= this.amount) {
            user.balance -= this.amount;

            const transfer = {
                sender: this.sender,
                recipient: this.recipient,
                amount: this.amount,
                securityQuestion: this.securityQuestion,
                securityQuestionAnswer: this.securityQuestionAnswer
            };

            let data = [];
            if (fs.existsSync('transfer.json')) {
                try {
                    data = JSON.parse(fs.readFileSync('transfer.json', 'utf8'));
                } catch (error) {
                    console.log("Error reading transfer data.");
                }
            }

            data.push(transfer);

            try {
                fs.writeFileSync('transfer.json', JSON.stringify(data, null, 2));
                console.log(`Transfer of $${this.amount} to ${this.recipient} was successful.`);
            } catch (error) {
                console.log("Error saving transfer data.");
            }

            return true;
        } else {
            console.log("Insufficient balance.");
            return false;
        }
    }

    acceptETransfer(user) {
        if (!user) {
            console.error("User object is not provided.");
            return false;
        }

        let data = [];
        if (fs.existsSync('transfer.json')) {
            try {
                data = JSON.parse(fs.readFileSync('transfer.json', 'utf8'));
            } catch (error) {
                console.log("Error reading transfer data.");
                return false;
            }
        }

        const pendingTransfers = data.filter(transfer => transfer.recipient === user.email);
        if (pendingTransfers.length === 0) {
            console.log("No pending transfers found.");
            return false;
        }

        const selectedTransfer = pendingTransfers[0];
        console.log(`Transfer of $${selectedTransfer.amount} from ${selectedTransfer.sender}`);
        const userAnswer = prompt(`${selectedTransfer.securityQuestion}: `);

        if (userAnswer === selectedTransfer.securityQuestionAnswer) {
            user.balance += selectedTransfer.amount;
            data = data.filter(transfer => transfer !== selectedTransfer);
            try {
                fs.writeFileSync('transfer.json', JSON.stringify(data, null, 2));
                console.log(`Transfer accepted. Your new balance is $${user.balance}`);
                return true;
            } catch (error) {
                console.log("Error saving transfer data.");
                return false;
            }
        } else {
            console.log("Incorrect answer. Transfer rejected.");
            return false;
        }
    }
}

module.exports = Etransfer;
