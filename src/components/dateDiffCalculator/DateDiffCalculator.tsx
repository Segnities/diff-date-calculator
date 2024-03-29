import React, { MutableRefObject, useRef, useState } from 'react';
import { useSpring, animated } from "@react-spring/web";

import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import moment from 'moment';

import type { DateDiff } from './dateDiff';
import { dateDiffValSchema } from "./dateDiffValSchema"

import './assets/scss/dateDiffCalculator.scss';

export default function DateDiffCalculator() {
   const [dateDiff, setDateDiff] = useState<DateDiff | undefined>();
   const animatedDay = useSpring({
      number: parseInt(dateDiff?.day || '0'),
      from: { number: 0 },
      config: { duration: 1700 }
   });
   const animatedMonth = useSpring({
      number: parseInt(dateDiff?.month || '0'),
      from: { number: 0 },
      config: { duration: 1700 }
   });
   const animatedYear = useSpring({
      number: parseInt(dateDiff?.year || '0'),
      from: { number: 0 },
      config: { duration: 1700 }
   });

   const daysRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
   const monthsRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
   const yearsRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

   const handleDiff = (values: DateDiff | undefined) => {
      if (values?.day && values.month && values.year) {
         const yearsDif = parseInt(yearsRef?.current?.value || values.year) - 1;
         const startDiffDate = moment(`${yearsDif}-${monthsRef?.current?.value}-${daysRef?.current?.value}`, 'YYYY-MM-DD');
         const nowDiffDate = moment();
         const years = nowDiffDate.diff(startDiffDate, 'years');
         const months = nowDiffDate.diff(startDiffDate, 'months') % 12;
         const days = nowDiffDate.diff(startDiffDate, 'days') % 30;

         const someNaN = Number.isNaN(years) || Number.isNaN(months) || Number.isNaN(days);
         const lessZero = years < 0 || months < 0 || days < 0;

         if (someNaN || lessZero) {
            setDateDiff(undefined);
         } else {
            setDateDiff({
               day: String(days),
               month: String(months),
               year: String(years),
            });
         }
      }
   };

   return (
      <div className="dateDiff-container">
         <Formik
            validateOnChange={true}
            validationSchema={dateDiffValSchema}
            initialValues={{ month: '', day: '', year: '' }}
            onSubmit={(val) => console.log(val)
            }>
            {({ errors, touched, values }: FormikProps<DateDiff>) => (
               <React.Fragment>
                  <Form onChange={() => handleDiff(values)} className="dateDiff-inputs">
                     <Field name='day'>
                        {({ field }: FieldProps) => (
                           <div className='inp-block'>
                              <label htmlFor="dd-input" className={errors.day && 'error-color'}>
                                 Day
                              </label>
                              <input ref={daysRef} {...field} type="text" id='dd-input' placeholder='DD' className={errors.day && 'error-border'} />
                              {(errors.day && touched.day) ? <p className='error-msg'>{errors.day}</p> : null}
                           </div>
                        )}
                     </Field>
                     <Field name='month'
                     >
                        {({ field }: FieldProps) => (
                           <div className='inp-block'>
                              <label htmlFor="mm-input" className={errors.month && 'error-color'}>Month</label>
                              <input ref={monthsRef} {...field} type="text" id='mm-input' placeholder='MM' className={errors.month && 'error-border'} />
                              {(errors.month && touched.month) ? <p className='error-msg'>{errors.month}</p> : null}
                           </div>
                        )}
                     </Field>
                     <Field name='year' >
                        {({ field }: FieldProps) => (
                           <div className='inp-block'>
                              <label htmlFor="yyyy-input" className={errors.year && 'error-color'}>Year</label>
                              <input ref={yearsRef} {...field} type="text" id='yyyy-input' placeholder='YYYY' className={errors.year && 'error-border'} />
                              {errors.year && touched.year ? <p className='error-msg'>{errors.year}</p> : null}
                           </div>
                        )}
                     </Field>
                  </Form>
                  <div className='divider'>
                     <hr />
                     <div className='star-arrow'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="44" viewBox="0 0 46 44"><g fill="none" stroke="#FFF" strokeWidth="2"><path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44" /></g></svg>
                     </div>
                  </div>
                  <div className='calculated-age__container'>
                  <div className='calculated-age__item'>
                        <animated.span className='nums-value'>
                           {
                              !Object.values(errors).length ?
                                 animatedYear.number.interpolate(value => value === 0 ? '--' : Math.floor(value)) :
                                 '--'
                           }
                        </animated.span> 
                        <span className='nums-title'>years</span>
                     </div>
                     <div className='calculated-age__item'>
                        <animated.span className='nums-value'>
                           {
                              !Object.values(errors).length ?
                                 animatedMonth.number.interpolate(value => value === 0 ? '--' : Math.floor(value)) :
                                 '--'
                           }
                        </animated.span> 
                        <span className='nums-title'>months</span>  
                     </div>
                     <div className='calculated-age__item'>
                        <animated.span className='nums-value'>

                           {
                              !Object.values(errors).length ?
                                 animatedDay.number.interpolate(value => value === 0 ? '--' : Math.floor(value)) :
                                 '--'
                           }
                        </animated.span> 
                        <span className='nums-title'>days</span>
                     </div>
                  </div>
               </React.Fragment>
            )}
         </Formik>
      </div>
   );
}