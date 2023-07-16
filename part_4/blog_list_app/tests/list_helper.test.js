import list_helper from "../utils/list_helper.js";

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const listWithMoreBlogs = [
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

test('dummy returns one', () => {
    const blogs = []
    const result = list_helper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('of a list with a single blog', () => {
        expect(list_helper.totalLikes(listWithOneBlog)).toBe(5)
    })
    test('of a list with more blogs', () => {
        expect(list_helper.totalLikes(listWithMoreBlogs)).toBe(36)
    })
    test('of an empty list', () => {
        expect(list_helper.totalLikes([])).toBe(0)
    })
})

describe('favorite blogs', () => {
    test('of a single blog list', () => {
        const favBlog = listWithOneBlog[0]
        const favBlogInfo = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes
        }
        expect(list_helper.favoriteBlog(listWithOneBlog)).toEqual(favBlogInfo)
    })
    test('of a list containing more blogs', () => {
        const favBlog = listWithMoreBlogs[2]
        const favBlogInfo = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes
        }
        expect(list_helper.favoriteBlog(listWithMoreBlogs)).toEqual(favBlogInfo)
    })
    test('of an empty list', () => {
        expect(list_helper.favoriteBlog([])).toBe(null)
    })
});
