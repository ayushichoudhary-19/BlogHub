import React, { useCallback, useEffect, useState } from 'react'
import { RTE, Button, Input, Select, Loader } from "../index"
import appwriteService from "../../appwrite/config"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {

    const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            author: post?.author || "Anonymous", 
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const [loading, setLoading] = useState(false)

    const submit = async (data) => {
        setLoading(true)
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined
            })
            if (dbPost) {
                setLoading(false)
                navigate(`/post/${post.$id}`)
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0])
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                try {
                    let dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id
                    })
                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                    }
                } catch (error) {
                    prompt(error.message)
                } finally {setLoading(false)}
            }

        }
    }
    
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";

    }, [])

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full lg:w-2/3 px-2">
                <Input
                    label={<>Title <span className='text-red-500'>*</span>:</>}
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label={<>Slug <span className='text-red-500'>*</span>:</>}
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                <Input 
                    label="Author :"
                    placeholder="Author"
                    className="mb-4"
                    {...register("author")}
                />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                    label={<>Featured Image <span className='text-red-500'>*</span>:</>}
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                {loading? 
                    <div className='w-full grid place-items-center'> <Loader></Loader></div>
                    :
                <Button type="submit" bgColor={post ? "bg-green-500" : "bg-customPink"} className= {` ${post? "  hover:shadow-green-500 text-black " : " hover:shadow-customPink text-white "} shadow-sm hover:cursor-pointer duration-200 hover:drop-shadow-2xl rounded-lg w-full`} >
                    {post ? "Update" : "Submit"}
                </Button>}
            </div>
        </form>
    )
}

export default PostForm
