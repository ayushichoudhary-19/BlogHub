import React, { useCallback, useEffect, useState } from "react";
import { RTE, Button, Input, Select, Loader } from "../index";
import appwriteService from "../../appwrite/config";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
        author: userData.name,
      },
    });

    const submit = async (data) => {
        setLoading(true);
        try {
          if (post) {
            const dbPost = await appwriteService.updatePost(post.$id, {
              ...data,
            });
            if (dbPost) {
              navigate(`/post/${post.$id}`);
            }
          } else {
            const dbPost = await appwriteService.createPost({
              ...data,
              userId: userData.$id,
            });
            if (dbPost) {
              navigate(`/post/${dbPost.$id}`);
            }
          }
        } catch (error) {
          prompt(error.message);
        } finally {
          setLoading(false);
        }
      };
      


  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-6 shadow-lg">
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col lg:flex-row gap-6"
      >
        <div className="w-full lg:w-2/3">
          <div className="space-y-4">
            <Input
              label={
                <>
                  Title <span className="text-red-500">*</span>
                </>
              }
              placeholder="Enter post title"
              className="border border-gray-700 text-white rounded-lg bg-gray-800 focus:bg-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              {...register("title", { required: true })}
            />

            <Input
              label={
                <>
                  Slug <span className="text-red-500">*</span>
                </>
              }
              placeholder="post-url-slug"
              className="border border-gray-700 text-white rounded-lg bg-gray-800 focus:bg-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />

            <div className="mt-6">
              <RTE
                label="Content:"
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
            </div>

            <Input
              label="Author:"
              placeholder="Author"
              className="border border-gray-700 text-gray-400 rounded-lg bg-gray-800 cursor-not-allowed"
              {...register("author")}
              disabled
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-white">
              Post Settings
            </h3>
            {/* 
                        {post && post.featuredImage && (
                            <div className="w-full mb-4">
                                <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                                <img
                                    src={appwriteService.getFilePreview(post.featuredImage)}
                                    alt={post.title}
                                    className="rounded-lg w-full h-auto object-cover"
                                />
                            </div>
                        )} */}

            <div className="mb-6">
              <Select
                options={["active", "inactive"]}
                label="Status"
                className="border border-gray-700 text-white rounded-lg bg-gray-800 focus:bg-gray-800 focus:border-purple-500"
                {...register("status", { required: true })}
              />
            </div>

            <div className="pt-4">
              {loading ? (
                <div className="w-full flex justify-center">
                  <Loader />
                </div>
              ) : (
                <Button
                  type="submit"
                  bgColor={post ? "bg-green-600" : "bg-purple-600"}
                  className={`hover:${
                    post ? "bg-green-700" : ""
                  } text-white font-medium py-3 gradient-btn rounded-lg w-full transition-all duration-200`}
                >
                  {post ? "Update Post" : "Publish Post"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
