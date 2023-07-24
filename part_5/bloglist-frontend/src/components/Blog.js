import {useState} from "react";
import blogService from "../services/blogs";

const Blog = ({blog}) => {
    const [visibleDetails, setVisibleDetails] = useState(false)
    const hideWhenVisible = {display: visibleDetails? 'none':''}
    const showWhenVisible = {display: visibleDetails? '':'none'}
    const toggleVisibility = () => {
        setVisibleDetails(!visibleDetails)
    }

    const updateLikes = async () => {
        blog.likes +=1
        try{
            await blogService.update(blog)
        } catch(error){
            console.log(error.message)
        }

    }

    return(
        <div className="blog">
            {blog.title} {blog.author}
            <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
            <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
            <div style={showWhenVisible}>
                <p>url: {blog.url}</p>
                <p>likes: {blog.likes} <button onClick={updateLikes}>like</button> </p>
                <p>{blog.user.name}</p>
            </div>
        </div>
    )
}




export default Blog