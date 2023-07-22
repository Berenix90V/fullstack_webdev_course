import Blog from '../models/blog.js'
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";



const initialUsers = [
    {
        username: "root",
        name: "Superuser",
        password: "password"
    }
]

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const blogIdNotExisting = async () => {
    const blog = {
        title: "title",
        author: "author",
        url: "url",
        likes: 9
    }
    const blogObject = new Blog(blog)
    await blogObject.save()
    await blogObject.deleteOne()
    return blogObject._id.toString()
}

const usersInDb = async () => {
    const users =  await User.find({})
    return users.map(user=>user.toJSON())
}

const blogCreator = async () => {
    const users = await usersInDb()
    return users[0]
}

const getInitialBlogsWithCreator = async () => {
    const creator = await blogCreator()
    for(const blog of initialBlogs){
        blog['user'] = creator.id
    }
    return initialBlogs
}

const getValidToken = async () => {
    const creator = await helper.blogCreator()
    const creatorToAuthenticate = {
        username: creator.username,
        id: creator.id
    }
    return jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
}

const helper={
    initialBlogs,
    initialUsers,
    blogsInDb,
    blogIdNotExisting,
    usersInDb,
    blogCreator,
    getInitialBlogsWithCreator,
    getValidToken
}

export default helper
