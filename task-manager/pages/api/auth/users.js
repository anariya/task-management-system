// In-memory user store, for development only
let users = [];

export function addUser(username, password) {
    users.push({ username, password });
}

export function getUser(username) {
    return users.find(user => user.username === username);
}
