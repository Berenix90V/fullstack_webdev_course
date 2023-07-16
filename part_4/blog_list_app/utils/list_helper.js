const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const sum = (total, blog) => {
        return total + blog.likes
    }
    return blogs.length === 0? 0 : blogs.reduce(sum,0)
}

const favoriteBlog = (blogs) => {
    const findFavBlog = (fav, blog) => {
        return fav.likes > blog.likes? fav : blog
    }

    const favBlog = blogs.length === 0? null : blogs.reduce(findFavBlog, 0)
    if (favBlog) {
        return {
            title:favBlog.title,
            author:favBlog.author,
            likes: favBlog.likes
        }
    } else {
        return null
    }

}

const list_helper = {
    dummy,
    totalLikes,
    favoriteBlog
}
export default list_helper
