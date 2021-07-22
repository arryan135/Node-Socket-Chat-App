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

// getUser
const getUser = (id) => users.find(user => user.id === id);

// getUsersInRoom
const getUsersInRoom = (room) => users.filter(user => room.trim().toLowerCase() === user.room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};