const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    return blogs.reduce((acc, cur) => acc + (cur['likes'] || 0), 0)
}

const favoriteBlog = (blogs) => {
    if (blogs) {
        return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, {})
    } else {
        return {}
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length>0) {
        const blogCountsByAuthor =  blogs.reduce((acc, cur) => {
            const author = cur.author
            if(!acc.hasOwnProperty(author)){acc[author] = 0}
            acc[author]++
            return acc
        }, {})
        const authorWithMostBlogs = Object.keys(blogCountsByAuthor).reduce((acc,cur) => {
            if (blogCountsByAuthor[acc] < blogCountsByAuthor[cur]) {
                acc = cur
            }
            return acc
        })
        return {
            author: authorWithMostBlogs,
            blogs: blogCountsByAuthor[authorWithMostBlogs]
        } 
    } else {
        return {}
    }
}

const mostLikes =(blogs) => {
    if (blogs.length>0) {
        const likeCountsByAuthor =  blogs.reduce((acc, cur) => {
            const author = cur.author
            if(!acc.hasOwnProperty(author)){acc[author] = 0}
            acc[author] = acc[author] + cur['likes']
            return acc
        }, {})
        const authorWithMostLikes = Object.keys(likeCountsByAuthor).reduce((acc,cur) => {
            if (likeCountsByAuthor[acc] < likeCountsByAuthor[cur]) {
                acc = cur
            }
            return acc
        })
        return {
            author: authorWithMostLikes,
            likes: likeCountsByAuthor[authorWithMostLikes]
        } 
    } else {
        return {}
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}