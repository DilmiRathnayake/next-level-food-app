'use server';

import fs from 'fs';
import path from 'path';
import { saveMeal } from './meals';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
  const image = formData.get('image');

  if (!image || image.size === 0) {
    return { message: 'Invalid image.' };
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${image.name}`;
  const imagePath = path.join(process.cwd(), 'public/images', fileName);

  fs.writeFileSync(imagePath, buffer);

  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: `/images/${fileName}`,
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image
  ) {
    return { message: 'Invalid input.' };
  }

  await saveMeal(meal);

  revalidatePath('/meals');
  redirect('/meals');
}
