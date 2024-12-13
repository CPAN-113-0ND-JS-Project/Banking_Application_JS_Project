const prompt = require('prompt-sync');

function getPositiveNumber(inputMsg) {
    let num;
    while (true) {
        try {
            num = parseFloat(prompt(inputMsg));
            if (isNaN(num) || num <= 0) {
                throw new Error("Invalid input. Please enter a positive number.");
            }
            break;
        } catch (err) {
            console.log(err.message);
        }
    }
    return num;
}

function getStrongPassword(inputMsg) {
    let password;
    while (true) {
        try {
            password = prompt(inputMsg).trim();
            if (password.length < 4) {
                throw new Error("Password too short. Must be at least 4 characters.");
            }
            break;
        } catch (err) {
            console.log(err.message);
        }
    }
    return password;
}

function getMenuChoice(options) {
    let choice;
    console.log("\n--- Main Menu ---");
    options.forEach((option, index) => console.log(`${index + 1}. ${option}`));

    while (true) {
        try {
            choice = parseInt(prompt("Choose an option: ").trim(), 10);
            if (isNaN(choice) || choice < 1 || choice > options.length) {
                throw new Error(`Invalid choice. Please select a number between 1 and ${options.length}.`);
            }
            break;
        } catch (err) {
            console.log(err.message);
        }
    }
    return choice;
}

function getConfirmation(inputMsg) {
    while (true) {
        const response = prompt(`${inputMsg} (y/n): `).trim().toLowerCase();
        if (response === 'y') return true;
        if (response === 'n') return false;
        console.log("Invalid input. Please enter 'y' or 'n'.");
    }
}

module.exports = {
    getPositiveNumber,
    getValidatedPIN,
    getStrongPassword,
    getMenuChoice,
    getConfirmation,
    sleep
};

