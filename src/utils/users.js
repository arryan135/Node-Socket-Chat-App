const users = [];

// addUser
const addUser = ({ id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room){
        return {
            error: "Username and room are required!"
        }
    }

    // Check for existing user
    const existingUser = users.find(user => user.username === username && user.room === room);

    // Validate username
    if (existingUser){
        return {
            error: "Username is in use!"
        }
    }

    // Store user
    const user = {id, username, room};
    users.push(user);
    return { user };
}

// removeUser
const removeUser = (id) => {
    // findIndex returns postion of the array item
    const index = users.findIndex((user) => user.id === id);

    if (index != -1){
        return users.splice(index, 1)[0];
    }
}

addUser({
    id: 22,
    username: "Arryan  ",
    room: "ann arbor"
});

console.log(users);

const removedUser = removeUser(22);

console.log(removedUser);
console.log(users);



// getUser
// getUsersInRoom