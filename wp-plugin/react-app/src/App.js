import logo from './logo.svg';
import './App.css';
import CategoryGrid from './CategoryGrid';

function App() {
  const data = window.pageMarquesReactData;
  console.log(data);
  return (
    <div className='w-full'>
      <CategoryGrid
      {...data}/>
    </div>
  );
}

export default App;
