import _ from "lodash";

const dummy = (blogs) => {
    return 1;
};
const totalLikes = (blogs) => {
    const sum = (total, blog) => {
        return total + blog.likes;
    };
    return blogs.length === 0 ? 0 : blogs.reduce(sum, 0);
};

const favoriteBlog = (blogs) => {
    const findFavBlog = (fav, blog) => {
        return fav.likes > blog.likes ? fav : blog;
    };

    const favBlog = blogs.length === 0 ? null : blogs.reduce(findFavBlog, 0);
    if (favBlog) {
        return {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes,
        };
    } else {
        return null;
    }
};

const mostBlogs = (blogs) => {
    const blogsByAuthor = _.countBy(blogs, (blog) => blog.author);
    const maxBlogs = _.max(_.values(blogsByAuthor));
    const authorWithMostBlogs = _.findKey(
        blogsByAuthor,
        (el) => el === maxBlogs,
    );
    return {
        author: authorWithMostBlogs,
        blogs: maxBlogs,
    };
};

const mostLikes = (blogs) => {
    const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author);
    const mapLikes = {};
    const sumLikes = (accumulator, blog) => {
        return accumulator + blog.likes;
    };
    _.forEach(blogsByAuthor, (value, key) => {
        mapLikes[key] = value.reduce(sumLikes, 0);
    });
    const maxLikes = _.max(_.values(mapLikes));
    const authorWithMostLikes = _.findKey(mapLikes, (el) => el === maxLikes);
    return {
        author: authorWithMostLikes,
        likes: maxLikes,
    };
};

const list_helper = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
export default list_helper;
