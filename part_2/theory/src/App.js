const App = (props) => {
  const {notes} = props
  return (
     <div>
       <h1>Notes</h1>
       <ul>
           {notes.map((note, i)=>
               <li key={i}>
                   {note.content}
               </li>)
           }
       </ul>
     </div>
  );
}

/*
case uses for index as key in map:
1. the list and items are static–they are not computed and do not change;
2. the items in the list have no ids;
3. the list is never reordered or filtered.
 */

export default App;
