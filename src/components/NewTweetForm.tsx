import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { type FormEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

export function NewTweetForm () {
  const session = useSession()

  if (session.status !== 'authenticated') return null

  return <Form />
}

function Form () {
  const session = useSession()
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>()
  // Assigning a callback to the ref property allows us to update the size as soon as the textarea is render (since the cb gets its execution)
  const inputRef = useCallback((textarea: HTMLTextAreaElement) => {
    updateTextareaSize(textarea)
    textareaRef.current = textarea
  }, [])
  const trpcUtils = api.useContext()
  const createTweet = api.tweet.create.useMutation({
    onSuccess: newTweet => {
      setInput('')
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, oldData => {
        if (oldData == null || oldData.pages[0] == null) return
        if (session.status !== 'authenticated') return

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null
          }
        }

        return {
          ...oldData,
          // Updating the first page so that the new element appears first
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets]
            },
            ...oldData.pages.slice(1)
          ]
        }
      })
    }
  })
  
  useLayoutEffect(() => updateTextareaSize(textareaRef.current), [input])
  
  if (session.status !== 'authenticated') return <></>
  
  const profileImage = session.data.user.image
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b  px-4 py-2">
      <div className="flex gap-4">
        <ProfileImage src={profileImage} />
        <textarea 
          name="draft" 
          id="draft"
          placeholder="What's happening?"
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          style={{ height: 0 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          ref={inputRef}
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  )

  function handleSubmit (e: FormEvent) {
    e.preventDefault()
    createTweet.mutate({ content: input })
  }
}

function updateTextareaSize (textarea?: HTMLTextAreaElement) {
  if (textarea == null) return

  textarea.style.height = '0'
  textarea.style.height = `${textarea.scrollHeight}px`
}
