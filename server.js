const express = require('express')
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const { default: axios } = require('axios');


const app = express();

let message = "This is a message"

// definitions of endpoints
const schema = buildSchema(`

    type User {
        name: String
        age: Int
        college: String
    }

    type Post{
        userId: Int
        id: Int
        title: String
        body: String
    }

    input UserInput{
        name: String!
        college: String!
        age: Int!
    }

    type Query{
        hello: String
        welcomeMessage(name: String): String
        getUser: User
        getUsers: [User]
        getPosts: [Post]
        getMessage: String
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(user: UserInput): User
    }

`)

//resolvers

const user = {
    name: "Abdullah",
    age: 22,
    college: "Dehli Science College"
}

const root = {
    hello: () => {
        return "Hello, World!"
    },
    welcomeMessage: (args) => {
        console.log(args)
        return args.name;
    },

    getUser: () => {
        return user;
    },
    getUsers: () => {
        const users = [
            {
                name: "Abdullah",
                age: 22,
                college: "Dehli Science College"
            },
            {
                name: "Ahmed",
                age: 22,
                college: "Adamjee College"
            }
        ]
        return users;
    },
    getPosts: async () => {
        const {data} = await axios.get('https://jsonplaceholder.typicode.com/posts')
        return data
    }, 
    setMessage: ({newMessage}) => {
        message = newMessage;
        return message;
    },
    getMessage: () => message,
    createUser: ({user}) => {
        return user
    }

}



app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema,
    rootValue: root
}))


app.listen(4000, () => {
    console.log('Server is llistening on port 4000')
})