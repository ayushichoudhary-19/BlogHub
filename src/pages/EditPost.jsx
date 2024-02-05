import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm } from '../Components'
import appwriteService from "../appwrite/config"

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        } else navigate('/')
    }, [slug, navigate])

    return post ? (
        <div className='py-8'>
            <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Edit Post</h1></div>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost