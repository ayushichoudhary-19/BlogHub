import React from 'react'
import { Container, PostForm } from '../Components'

function AddPost() {
  return (
    <div className='py-8'>
      <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Add Post</h1></div>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost