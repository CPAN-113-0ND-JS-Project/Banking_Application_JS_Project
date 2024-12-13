
const fs = require('fs');
const readline =require('readline-sync');

class Etransfer {
    constructor(sender, recipient, amount, securityQuestion, securityQuestionAnswer) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.securityQuestion = securityQuestion;
        this.securityQuestionAnswer = securityQuestionAnswer;
    }
       // Method to send E-transfer
    sendETransfer(user) {
        if (user.balance >= this.amount) {
            user.balance -= this.amount; //Deduct amount from users balance
            const transfer = {
                sender: this.sender,
                recipient: this.recipient,
                amount: this.amount,
                securityQuestion: this.securityQuestion,
                securityQuestionAnswer: this.securityQuestionAnswer

            };
            //Checking for exsisting tranfers or setting a new array if file doesn't exist
            let data = [];
            if (fs.existsSync(transfer.json)) {
            try {
                data = JSON.parse(fs.readFileSync('transfer.json', 'utf8'));
            } catch (error) {
                console.error('Error interperting transfer.json');
            }
        }
            
            data.push(transfer);
            try {
            fs.writeFileSync('transfer.json', JSON.stringify(data, null, 2));
           console.log(`E-Transfer of $${this.amount} transfered to ${this.recipient}.`);
             return true
            } catch(error) {
                console.error("failed to tranfer");
                user.balance += this.amount;
                return false;
            } 
    } else {
        console.log("Insuffent funds");
        return false;
    }
}
    //Mehod to accept transfer
    static acceptETransfer(user) {
        let data = [];
        if (fs.existsSync(transfer.json)) {
        try {
            data = JSON.parse(fs.readFileSync('transfer.json', 'utf8'));
        } catch (error) {
            console.error('error interperting transfer.json');
            return false;
        }
        } else {
            console.log('No pending transfer for user');
            return false;
        }
        
        
        const pendingTransfer = data.filter(transfer => transfer.recipient === user.email);
        
        if (pendingTransfer.length === 0) {
            console.log('no pending transfers');
            return false;
        }

        console.log("pending transfers");
        pendingTransfer.forEach((transfer, index) => {
            console.log(`${index + 1} Amount: $${transfer.amount}, security Question: ${transfer.securityQuestion}`);

        });

        const chosenIndex = parseInt(readline.question('Enter the number of the transfer you want to accept:')) - 1;
        
        if (isNaN(chosenIndex)|| chosenIndex < 0 || chosenIndex >= pendingTransfer.length) {
            console.log('invalid selection');
            return false;
        }
        const chosenTransfer = pendingTransfer[chosenIndex];

        const UserAnswer = readline.question('Answer the security question:');
      
        if (UserAnswer === chosenTransfer.securityQuestionAnswer) {
            user.balance += chosenTransfer.amount; // Adds amount to user balance
            console.log(`E-transfer of $${chosenTransfer.amount} accpepted. New balance: $${user.balance}`);



         const updatedTransfers = data.filter(transfer =>
            !(transfer.sender === chosenTransfer.sender &&
                transfer.recipient === chosenTransfer.recipient &&
                transfer.amount === chosenTransfer.amount &&
                transfer.securityQuestion === chosenTransfer.securityQuestionAnswer)
            );

            try {
                fs.writeFileSync('transfer.json', JSON.stringify(updatedTransfers, null, 2));
            } catch (error) {
                console.log('Error updating Transfer.json file');
            }

            return true;
        } else {
            console.log("Incorrect answer. transfer not accepted");
            return false;
        }
    }
}

module.exports = Etransfer

