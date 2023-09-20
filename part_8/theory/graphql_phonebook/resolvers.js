import Person from "./models/person.js";
import {GraphQLError} from "graphql/index.js";
import User from "./models/user.js";
import jsonwebtoken from "jsonwebtoken";
import {PubSub} from 'graphql-subscriptions'

const pubsub = new PubSub()

const resolvers = {
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        },
        friendOf: async (root) => {
            const friends = await User.find({
                friends: {
                    $in: [root.id]
                }
            })
            return []
        }
    },

    Query: {
        personCount: async() => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            if(!args.phone){
                return Person.find({})
            }
            return Person.find({phone: {$exists: args.phone === 'YES'}})
        },
        findPerson: async (root, args) => Person.findOne({ name: args.name }),
        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Mutation: {
        addPerson: async (root, args, context) => {
            const person = new Person({...args})
            const currentUser = context.currentUser

            console.log(person)

            if(!currentUser){
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            try{
                await person.save()
                currentUser.friends = currentUser.friends.concat(person)
                await currentUser.save()
            } catch(error){
                throw new GraphQLError('Saving person failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }

            pubsub.publish('PERSON_ADDED', {personAdded: person})
            return person
        },
        editNumber: async (root, args) => {
            const person = await Person.findOne({name: args.name})
            person.phone = args.phone
            try{
                return await person.save()
            } catch(error){
                throw new GraphQLError('Saving number failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        createUser: async (root, args) => {
            const user = new User({username: args.username})
            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({username: args.username})

            if( !user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions:{
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }

            return {value: jsonwebtoken.sign(userForToken, process.env.JWT_SECRET)}
        },
        addAsFriend: async(root, args, {currentUser}) => {
            const isFriend = (person) =>
                currentUser.friends.map(f=>f._id.toString()).includes(person._id.toString())
            if(!currentUser) {
                throw new GraphQLError('wrong credentials', {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }

            const person = await Person.findOne({name:args.name})
            if(!isFriend(person)){
                currentUser.friends = currentUser.friends.concat(person)
            }
            await currentUser.save()
            return currentUser
        }
    },
    Subscription: {
        personAdded: {
            subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
        }
    }
}

export default resolvers