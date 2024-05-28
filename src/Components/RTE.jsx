import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'

export default function RTE({name, control, label, defaultValue =""}) {
    return (
      <div className='w-full'> 
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
  
      <Controller
      name={name || "content"}
      control={control}
      render={({field: {onChange}}) => (
          <Editor
          apiKey="4gl25x788cncajq1ndmn4abgxpdardimn7ycopqgccdsh7gk"
          initialValue={defaultValue}
          init={{
              initialValue: defaultValue,
              height: 500,
              skin: 'oxide-dark',
              content_css:'dark',
              content_style: 'body { font-family:Nunito,Helvetica,Arial,sans-serif; font-size:16px }',
              plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "code",
                  "help",
                  "wordcount",
                  "anchor",
              ],
              toolbar:
              "undo redo | blocks | bold italic forecolor | alignleft aligncenter | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
          }}
          onEditorChange={onChange}
          />
      )}
      />
  
       </div>
    )
  }