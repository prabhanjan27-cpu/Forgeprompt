
import Link from 'next/link'

export const Form = ({type,post,setPost,submitting,handleSubmit}) => {
  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'><span className='blue_gradient'>{type} Post</span></h1>
      <p className='desc text-left max-w-md'>
        {type} and share amazing prompts with the world, and let your imagination run wild with any AI-powered platform
      </p>

      <form onSubmit={handleSubmit}
      className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>

        <label className='flex flex-col gap-2'>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Your AI Prompt
          </span>

          <textarea
          value={post.prompt}
          onChange={(e)=>setPost({...post,
            prompt:e.target.value})}
            placeholder='write your prompt here...👇'
            required
            className='form-textarea w-full min-h-25 '
              />
        </label>
        <label className='flex flex-col gap-2' >
          <span className='font-satoshi font-semibold text-base text-gray-700'>
             Tag{` `}
             <span className='font-normal'>(#product, #web-development, #idea)</span>
          </span>


          <input
          value={post.tag}
          onChange={(e)=>setPost({...post,
            tag:e.target.value})}
            placeholder='#tag'
            required
            className='form-input'
              />
        </label>
        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href={"/" }className='text-gray-500 text-sm hover:text-gray-700'>Cancel</Link>

          <button type='submit'
          disabled={submitting}
          className='rounded-full bg-orange-500 px-6 py-3 text-white
               hover:bg-orange-600 transition-colors'>
            {submitting ? `${type}...`:type}
             </button>
        </div>
      </form>
    </section>
  )
}

