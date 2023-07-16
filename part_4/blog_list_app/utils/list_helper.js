const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const sum = (total, blog) => {
        return total + blog.likes
    }
    return blogs.length === 0? 0 : blogs.reduce(sum,0)
}

const list_helper = {dummy, totalLikes}
export default list_helper
