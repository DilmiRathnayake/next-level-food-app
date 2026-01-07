'use client';

import { useFormState, useFormStatus } from "react-dom";

export default function MealsFormSubmit(){
    const{pending}= useFormStatus();

    return(
    <button disabled={pending}>
        {pending? 'Submitting...' : 'Share Meal'}
    </button>
    );
}