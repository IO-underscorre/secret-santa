// Classes
class User {
    exclusions = [];
    giftRecipient = {};

    constructor(index, name) {
        this.index = index;
        this.name = name;
    }

    updateExclusions(user) {
        const index = this.exclusions.indexOf(user);

        if (index !== -1) {
            this.exclusions.splice(index, 1);
        } else {
            this.exclusions.push(user);
        }
    }

    updateGiftRecipient(user) {
        this.giftRecipient = user;
    }
}


// Functions
function writeUserInList(index, name, listElement) {
    const userElement = document.createElement('li');
    userElement.classList.add('user');
    userElement.dataset.index = index;
    userElement.innerHTML = `
                        <input type="checkbox" disabled title="Add to Current Exclusion List">

                        <span class="sender-name">
                            ${name}
                        </span>

                        <span class="reciver-name">
                        </span>

                        <menu class="user-options">
                            <li>
                                <button class="edit-exclusion" title="Edit Allowed Reciver List">&#9998;</button>
                            </li>

                            <li>
                                <button class="delete-user" title="Delete User">&#10006;</button>
                            </li>
                        </menu>
                        `;
    userElement.querySelector('.edit-exclusion').addEventListener('click', event => switchExclusionMode(event, userElement, true));
    userElement.querySelector('.delete-user').addEventListener('click', event => deleteUser(userElement));
    userElement.querySelector('input[type="checkbox"]').addEventListener('change', event => updateCurrentExclusionList(event));
    listElement.append(userElement);

    if (!document.querySelector('#generate-table-button')) {
        const generateTableButton = document.createElement('button');
        generateTableButton.id = 'generate-table-button';
        generateTableButton.textContent = 'Generate Gift Exchanges';
        generateTableButton.addEventListener('click', event => debounce(generateExchangesTable, 500));
        document.querySelector('main').appendChild(generateTableButton);
    }
}

function switchExclusionMode(event, userElem, isStartingExclusionMode) {
    const otherInputs = document.querySelectorAll('input:not([type="checkbox"]), button');
    const checkboxes = document.querySelectorAll('[type="checkbox"]');

    if (isStartingExclusionMode) {
        exclusionModeCurrentIndex = userElem.dataset.index;
        const exclusionModeCurrentUser = findUserFromUserIndexInArray(exclusionModeCurrentIndex, usersArray);

        event.target.innerHTML = `&#10004;`;

        otherInputs.forEach(input => input.disabled = event.target !== input);
        checkboxes.forEach(checkbox => {
            checkbox.disabled = userElem.contains(checkbox);
            checkbox.checked = !exclusionModeCurrentUser.exclusions.some(user => user.index == checkbox.parentElement.dataset.index);
        });
    } else {
        exclusionModeCurrentIndex = false;

        event.target.innerHTML = `&#9998;`;

        otherInputs.forEach(input => input.disabled = false);
        checkboxes.forEach(checkbox => checkbox.disabled = true);
    }

    event.target.addEventListener('click', (event) => switchExclusionMode(event, userElem, !isStartingExclusionMode));
}

function deleteUser(userElem) {
    usersArray.splice(usersArray.findIndex(user => user.index == userElem.dataset.index), 1);

    userElem.remove();
}

function updateCurrentExclusionList(event) {
    const exclusionModeCurrentUser = findUserFromUserIndexInArray(exclusionModeCurrentIndex, usersArray);

    exclusionModeCurrentUser.updateExclusions(findUserFromUserIndexInArray(event.target.parentElement.dataset.index, usersArray));
}

function generateExchangesTable() {
    const orderedUsers = usersArray.toSorted((user1, user2) => user2.exclusions.length - user1.exclusions.length);
    const alreadyExtractedRecipients = [];

    const error = orderedUsers.some(user => {
        const forbiddenUsers = new Set(alreadyExtractedRecipients.concat(user.exclusions, [user]));

        const possibleRecipients = usersArray.filter(recipient => !forbiddenUsers.has(recipient));

        if (possibleRecipients.length) {
            const recipient = possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];

            alreadyExtractedRecipients.push(recipient);
            user.updateGiftRecipient(recipient);

            return false;
        } else {
            return true;
        }
    });

    if (error) {
        alert('Impossible to generate gift exchanges');
    } else {
        const recipientSpans = document.querySelectorAll('.reciver-name');
        recipientSpans.forEach(span => {
            span.textContent = findUserFromUserIndexInArray(span.parentElement.dataset.index, usersArray).giftRecipient.name;
        });
    }
}

function findUserFromUserIndexInArray(indexToFind, array) {
    return array.find(user => user.index == indexToFind);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}


// Main
const usersArray = [];
let indexOfNewUser = 0;
let exclusionModeCurrentIndex = false;

const newUserFormElement = document.querySelector('#new-user');
const newUserInputElement = document.querySelector('#new-user-input');
const usersListElement = document.querySelector('#users-list');

newUserFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    indexOfNewUser += 1;

    usersArray.push(new User(indexOfNewUser, newUserInputElement.value));

    writeUserInList(indexOfNewUser, newUserInputElement.value, usersListElement);

    newUserInputElement.value = '';
});
