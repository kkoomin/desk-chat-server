// Current Users
let users = [];

const addUser = () => {
  users.push({});
  return users;
};

const getUserList = id => {
  return {};
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { users, addUser, removeUser };
