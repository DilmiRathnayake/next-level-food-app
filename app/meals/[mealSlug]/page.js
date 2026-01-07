import Image from 'next/image';
import { getMeal } from '@/lib/meals';
import classes from './page.module.css';

export const metadata = {
  title: 'All Meals',
  description: 'Browse the delicious meals shared by our vibrant community',
};

export default async function MealDetailsPage({ params }) {
  const meal = await getMeal(params.mealSlug);

  if (!meal) {
    return <p className={classes.loading}>Meal not found.</p>;
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            sizes="(max-width: 768px) 100vw, 30rem"
          />
        </div>

        <div className={classes.headerText}>
          <h1>{meal.title}</h1>

          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>

         
          <p className={classes.summary}>
            {meal.summary}
          </p>
        </div>
      </header>

      <main>
       
        <div
          className={classes.instruction}
          dangerouslySetInnerHTML={{
            __html: meal.instructions.replace(/\n/g, '<br />'),
          }}
        />
      </main>
    </>
  );
}
