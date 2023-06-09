import { type Image } from "@prisma/client";
import { type FormEvent, useState } from "react";
import { Button } from "./Button";
import { LoadedImagePreview } from "./LoadedImagePreview";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  cloudinaryEndpoint,
  cloudinaryTweetsPreset,
} from "~/utils/cloudinaryConfig";
import { useRouter } from "next/router";

export function EditProfileForm(props: {
  bio: string;
  background: Image | null;
  profileLink: string;
}) {
  const session = useSession();
  const [bio, setBio] = useState(props.bio);
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    props.background?.secureUrl
  );
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const updateProfile = api.profile.updateProfile.useMutation();

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="m-3">
        <label htmlFor="bio" className="mb-2 block">
          Your bio
        </label>
        <input
          type="text"
          id="bio"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Welcome to my Profile"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-invalid={bio.length > 191}
          aria-errormessage="bioTooLong"
        />
        <span
          id="bioTooLong"
          className={`${bio.length < 191 ? "hidden" : ""} my-2 text-red-600`}
        >
          Maximum of 191 characters
        </span>
      </div>
      <div className="mx-3 mb-6">
        <label htmlFor="img" className="mb-2 block">
          Your background picture
        </label>
        <input
          type="file"
          id="img"
          name="img"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          accept="image/*"
        />
      </div>

      <div className="mx-3 mb-6">
        {imageSrc && (
          <LoadedImagePreview
            className="mx-auto pt-6"
            imageSrc={imageSrc}
            loading={loading || updateProfile.isLoading}
            setImageSrc={setImageSrc}
          />
        )}
      </div>

      <Button
        aria-label="Submit"
        type="submit"
        disabled={loading || updateProfile.isLoading}
        className="m-3"
      >
        Submit
      </Button>
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
    const altText = (
      document.getElementById("altText") as HTMLInputElement | undefined
    )?.value;
    if (
      loading ||
      updateProfile.isLoading ||
      bio.length > 191 ||
      (altText && altText.length > 191)
    )
      return;

    setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const fileInput = Array.from(form.elements).find(
      (control) => (control as HTMLInputElement).name === "img"
    ) as HTMLInputElement;
    const files = fileInput?.files;
    if (files == null || files?.length === 0) {
      if (bio.trim().length !== 0) {
        if (props.background && imageSrc != null) {
          updateProfile.mutate({
            userId: session.data?.user.id ?? "",
            bio,
            background: props.background,
          });
        } else {
          updateProfile.mutate({
            userId: session.data?.user.id ?? "",
            bio,
            background: undefined,
          });
        }
        void router.push(props.profileLink);
      }

      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", cloudinaryTweetsPreset);

    fetch(cloudinaryEndpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        response
          .json()
          .then(({ secure_url, width, height }) => {
            updateProfile.mutate({
              userId: session.data?.user.id ?? "",
              bio,
              background: {
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
        void router.push(props.profileLink);
      });
  }
}
