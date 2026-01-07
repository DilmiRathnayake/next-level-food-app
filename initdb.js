import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return db.prepare('SELECT * FROM meals').all();
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export function saveMeal(meal) {
  // ✅ UNIQUE slug (THIS IS THE FIX)
  meal.slug =
    slugify(meal.title, { lower: true }) + '-' + Date.now();

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
