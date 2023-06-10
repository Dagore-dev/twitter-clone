import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";
import { ImageInput } from "./ImageInput";
import { LoadedImagePreview } from "./LoadedImagePreview";

export function NewTweetForm() {
  const session = useSession();

  if (session.status !== "authenticated") return null;

  return <Form />;
}

function Form() {
  const session = useSession();
  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>();
  // Assigning a callback to the ref property allows us to update the size as soon as the textarea is render (since the cb gets its execution)
  const inputRef = useCallback((textarea: HTMLTextAreaElement) => {
    updateTextareaSize(textarea);
    textareaRef.current = textarea;
  }, []);
  const trpcUtils = api.useContext();
  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInput("");
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;
        if (session.status !== "authenticated") return;
        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null,
          },
        };

        return {
          ...oldData,
          // Updating the first page so that the new element appears first
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  useLayoutEffect(() => updateTextareaSize(textareaRef.current), [input]);

  if (session.status !== "authenticated") return <></>;

  const profileImage = session.data.user.image;
  return (
    <form
      method="POST"
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={profileImage} />
        <textarea
          name="draft"
          id="draft"
          placeholder="What's happening?"
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          style={{ height: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          readOnly={isLoading || createTweet.isLoading}
          ref={inputRef}
        />
      </div>

      <div
        className={`ml-10 flex ${
          imageSrc == null ? "" : "flex-col"
        } items-center justify-between pl-10 pt-2`}
      >
        {imageSrc && (
          <LoadedImagePreview
            className=""
            imageSrc={imageSrc}
            loading={isLoading || createTweet.isLoading}
            setImageSrc={setImageSrc}
          />
        )}
        <ImageInput className={`py-2 ${imageSrc == null ? "" : "hidden"}`} />
        <Button
          aria-label="Send tweet"
          className={`${imageSrc == null ? "" : "mt-4 self-end"}`}
          disabled={isLoading || createTweet.isLoading}
        >
          Tweet
        </Button>
      </div>
    </form>
  );

  function handleChange(e: FormEvent) {
    const reader = new FileReader();

    reader.onload = (onLoad) => {
      const target = onLoad.target;
      if (target != null) {
        setImageSrc(target.result?.toString());
      }
    };

    const fileInput = e.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      reader.readAsDataURL(fileInput.files[0] as File);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLoading || createTweet.isLoading) return;

    setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const fileInput = Array.from(form.elements).find(
      (control) => (control as HTMLInputElement).name === "img"
    ) as HTMLInputElement;
    const files = fileInput?.files;
    if (files == null || files?.length === 0) {
      input.trim().length !== 0 && createTweet.mutate({ content: input });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", "tweets_images");
    const altText = (
      document.getElementById("altText") as HTMLInputElement | undefined
    )?.value;

    fetch("https://api.cloudinary.com/v1_1/dmhvmoqu2/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        response
          .json()
          .then(({ secure_url, width, height }) => {
            createTweet.mutate({
              content: input,
              image: {
                secureUrl: secure_url as string,
                width: width as number,
                height: height as number,
                alt: altText?.trim().length === 0 ? undefined : altText,
              },
            });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setImageSrc(undefined);
        setIsLoading(false);
        form.reset();
      });
  }
}

function updateTextareaSize(textarea?: HTMLTextAreaElement) {
  if (textarea == null) return;

  textarea.style.height = "0";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
