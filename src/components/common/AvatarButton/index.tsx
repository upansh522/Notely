"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

const AvatarButton = () => {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    user && checkUser();
  }, [user]);

  const checkUser = async () => {
    await createUser({
      email: user?.primaryEmailAddress?.emailAddress!,
      imageUrl: user?.imageUrl!,
      userName: user?.fullName!,
    });
  };

  return (
    <div className="flex justify-center">
      <UserButton showName />
    </div>
  );
};
export default AvatarButton;
