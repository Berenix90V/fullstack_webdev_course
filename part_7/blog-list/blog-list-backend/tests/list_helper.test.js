import list_helper from "../utils/list_helper.js";
import helper from "./test_helper.js";

const listWithOneBlog = [
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
    },
];
const listWithMoreBlogs = helper.initialBlogs;

test("dummy returns one", () => {
    const blogs = [];
    const result = list_helper.dummy(blogs);
    expect(result).toBe(1);
});

describe("total likes", () => {
    test("of a list with a single blog", () => {
        expect(list_helper.totalLikes(listWithOneBlog)).toBe(5);
    });
    test("of a list with more blogs", () => {
        expect(list_helper.totalLikes(listWithMoreBlogs)).toBe(36);
    });
    test("of an empty list", () => {
        expect(list_helper.totalLikes([])).toBe(0);
    });
});

describe("favorite blogs", () => {
    test("of a single blog list", () => {
        const favBlog = listWithOneBlog[0];
        const favBlogInfo = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes,
        };
        expect(list_helper.favoriteBlog(listWithOneBlog)).toEqual(favBlogInfo);
    });
    test("of a list containing more blogs", () => {
        const favBlog = listWithMoreBlogs[2];
        const favBlogInfo = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes,
        };
        expect(list_helper.favoriteBlog(listWithMoreBlogs)).toEqual(
            favBlogInfo,
        );
    });
    test("of an empty list", () => {
        expect(list_helper.favoriteBlog([])).toBe(null);
    });
});

describe("Author with most blogs", () => {
    test("of an empty list", () => {
        const authorWithMostBlogs = {
            author: undefined,
            blogs: undefined,
        };
        expect(list_helper.mostBlogs([])).toEqual(authorWithMostBlogs);
    });
    test("of a list with a single blog", () => {
        const authorWithMostBlogs = {
            author: listWithOneBlog[0].author,
            blogs: 1,
        };
        expect(list_helper.mostBlogs(listWithOneBlog)).toEqual(
            authorWithMostBlogs,
        );
    });
    test("of a list with more blogs", () => {
        const authorWithMostBlogs = {
            author: "Robert C. Martin",
            blogs: 3,
        };
        expect(list_helper.mostBlogs(listWithMoreBlogs)).toEqual(
            authorWithMostBlogs,
        );
    });
    test("of a list with more blogs and 2 top authors", () => {
        const listWithTwoTopAuthors = [...listWithMoreBlogs];
        listWithTwoTopAuthors.pop();
        const authorWithMostBlogs = {
            author: "Edsger W. Dijkstra",
            blogs: 2,
        };
        expect(list_helper.mostBlogs(listWithTwoTopAuthors)).toEqual(
            authorWithMostBlogs,
        );
    });
});

describe("author with most likes", function () {
    test("in an empty list", () => {
        const authorWithMostLikes = {
            author: undefined,
            likes: undefined,
        };
        expect(list_helper.mostLikes([])).toEqual(authorWithMostLikes);
    });
    test("in a list with a single blog", () => {
        const authorWithMostLikes = {
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes,
        };
        expect(list_helper.mostLikes(listWithOneBlog)).toEqual(
            authorWithMostLikes,
        );
    });
    test("in a list of more blogs", () => {
        const authorWithMostLikes = {
            author: "Edsger W. Dijkstra",
            likes: 17,
        };
        expect(list_helper.mostLikes(listWithMoreBlogs)).toEqual(
            authorWithMostLikes,
        );
    });
});
