import React from "react";

export default async function UserProfile({ params }: any) {
  const { id } = await params; // unwrap the promise

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <hr className="mb-6" />
        <p className="text-2xl">
          Profile Page for{" "}
          <span className="px-3 py-1 ml-2 rounded bg-blue-500 text-black font-semibold">
            {id}
          </span>
        </p>
      </div>
    </div>
  );
}