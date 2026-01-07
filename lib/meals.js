// lib/meals.js
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import path from 'path';
import fs from 'fs';

const db = sql('meals.db'); // Make sure meals.db is in the project root

//  Get all meals
export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

//  Get a single meal by slug
export async function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

//  Save a meal
export function saveMeal(meal) {
  // Make slug unique
  meal.slug = `${slugify(meal.title, { lower: true })}-${Date.now()}`;

  // Sanitize instructions
  meal.instructions = xss(meal.instructions);


  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}
