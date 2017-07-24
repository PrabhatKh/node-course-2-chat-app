// class Person {
//     constructor(name, age){
//         this.name=name;
//         this.age=age;

//     }

//     getUserDescription(){
//         return `${this.name} is ${this.age} years old`
//     }
// }

// var me = new Person('Prabhat',30);
// var description = me.getUserDescription();
// console.log(description);

class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, roomname){
        var user={id, name, roomname};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        var user= this.getUser(id);

        if(user){
            this.users = this.users.filter((user)=> user.id !== id);
        }
        return user;
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(roomname){
        var users = this.users.filter((user)=> user.roomname === roomname);
        var namesArray = users.map((user)=>  user.name );

        return namesArray;
    }
}

module.exports = {Users};