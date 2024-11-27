// Classes
class User {
    exclusions = [];

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
}


// Functions
function writeUserInList(index, name, listElement) {
    const userElement = document.createElement('li');
    userElement.classList.add('user');
    userElement.dataset.index = index;
    userElement.innerHTML = `
                        <input type="checkbox" disabled title="Add to Current Exclusion List">

                        <span class="name">
                            ${name}
                        </span>

                        <menu class="user-options">
                            <li>
                                <button class="edit-exclusion" title="Edit Exclusion List">&#9998;</button>
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
}

function switchExclusionMode(event, userElem, isStartingExclusionMode) {
    const otherInputs = document.querySelectorAll('input:not([type="checkbox"]), button');
    const checkboxes = document.querySelectorAll('[type="checkbox"]');

    if (isStartingExclusionMode) {
        exclusionModeCurrentIndex = userElem.dataset.index;
        const exclusionModeCurrentUser = findUserFromIncexInArray(exclusionModeCurrentIndex, usersArray);

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
    const exclusionModeCurrentUser = findUserFromIncexInArray(exclusionModeCurrentIndex, usersArray);

    exclusionModeCurrentUser.updateExclusions(findUserFromIncexInArray(event.target.parentElement.dataset.index, usersArray));
}

function findUserFromIncexInArray(indexToFind, array) {
    return array.find(user => user.index == indexToFind);
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
