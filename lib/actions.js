"use server";

import { saveMeal } from "@/lib/meals";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text?.trim() === "";
}

export async function shareMeal(_prevState, formData) {
  // set as action on form
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  for (const [key, value] of Object.entries(meal)) {
    if (typeof value === "string" && isInvalidText(value)) {
      return {
        message: `Invalid ${key}`,
      };
    }
  }

  if (!meal.creator_email.includes("@")) {
    return {
      message: "Invalid email",
    };
  }

  if (!meal.image || meal.image.size === 0) {
    return {
      message: "Invalid image",
    };
  }

  await saveMeal(meal);

  // passing in layout revalidatePath("/meals", "layout"); to revalidate the cache for all pages with the layout
  revalidatePath("/meals");
  redirect("/meals");
}
