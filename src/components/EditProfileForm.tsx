import { type Image } from "@prisma/client";
import { type FormEvent, useState } from "react";
import { Button } from "./Button";
import { LoadedImagePreview } from "./LoadedImagePreview";

export function EditProfileForm(props: {
  bio: string;
  background: Image | null;
}) {
  const [bio, setBio] = useState(props.bio);
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    props.background?.secureUrl
  );

  return (
    <form onChange={handleChange}>
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
        />
      </div>
      <div className="mx-3 mb-6">
        <label htmlFor="background" className="mb-2 block">
          Your background picture
        </label>
        <input
          type="file"
          id="background"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          accept="image/*"
        />
      </div>

      <div className="mx-3 mb-6">
        {imageSrc && (
          <LoadedImagePreview
            className="mx-auto pt-6"
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
          />
        )}
      </div>

      <Button type="submit" className="m-3">
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
}
