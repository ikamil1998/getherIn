class Users {
  constructor() {
    this.users = [];
  }
  AddUserData(id, userID, room) {
    var user = { id, room, userID };
    this.users.push(user);
    return user;
  }

  RemoveUser(id) {
    var user = this.GetUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  GetUser(id) {
    var getUser = this.users.filter((userId) => {
      return userId.id === id;
    })[0];
    return getUser;
  }

  GetUsersList(room) {
    var users = this.users.filter((user) => user.room === room);
    let data = users.map((item) => item.userID);
    let uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);

    return uniqueData;
  }
}

module.exports = Users;
