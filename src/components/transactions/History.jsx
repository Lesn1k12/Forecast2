// import React from 'react'
// import { useGlobalContext, GlobalProvider } from '../context/GlobalContext';



// function IncomeItem({
//     id,
//     title,
//     amount,
//     date,
//     category,
//     description,
//     deleteItem,
//     indicatorColor,
//     type
// }) {

//     console.log('Props:', { id, title, amount, date, category, description, type });

//     const handleDelete = () => {
//         deleteItem(id);
//       };

//     const dateFormat = (time) =>{
//         return moment(time).format('DD/MM/YYYY')
//     }

//     const categoryIcon = () =>{
//         switch(category) {
//             case 'salary':
//                 return money;
//             case 'freelancing':
//                 return freelance
//             case 'investments':
//                 return stocks;
//             case 'stocks':
//                 return users;
//             case 'bitcoin':
//                 return bitcoin;
//             case 'bank':
//                 return card;
//             case 'youtube':
//                 return yt;
//             case 'education':
//                 return book;
//             case 'groceries':
//                 return food;
//             case 'health':
//                 return medical;
//             case 'subscriptions':
//                 return tv;
//             case 'takeaways':
//                 return takeaway;
//             case 'clothing':
//                 return clothing;
//             case 'travelling':
//                 return freelance;
//             case 'other':
//                 return circle;
//             default:
//                 return ''
//         }
//     }

//     const expenseCatIcon = () => {
//         switch (category) {
//             case 'education':
//                 return book;
//             case 'groceries':
//                 return food;
//             case 'health':
//                 return medical;
//             case 'subscriptions':
//                 return tv;
//             case 'takeaways':
//                 return takeaway;
//             case 'clothing':
//                 return clothing;
//             case 'travelling':
//                 return freelance;
//             case 'other':
//                 return circle;
//             default:
//                 return ''
//         }
//     }

//     return (
//         <div className={`${styles.IncomeItemStyled}`} style={{ backgroundColor: indicatorColor }}>
//             <div className={`${styles.icon}`}>
//                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
//             </div>
//             <div className={`${styles.content}`}>
//                 <h5>{title}</h5>
//                 <div className={`${styles.innerContent}`}>
//                     <div className={`${styles.text}`}>
//                         <p>{dollar} {amount}</p>
//                         <p>{calender} {dateFormat(date)}</p>
//                         <p>
//                             {comment}
//                             {description}
//                         </p>
//                     </div>
//                     <div className={`${styles.btnCon}`}>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default IncomeItem