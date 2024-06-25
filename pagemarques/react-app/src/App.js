import logo from './logo.svg';
import './App.css';
import CategoryGrid from './CategoryGrid';

function App() {
  const data = window.pageMarquesReactData;
  console.log(data);
  return (
    <div className='w-full'>
      {(data.data && data.data.categories.length > 0) ? <CategoryGrid
        {...data} /> : <div className='py-6 px-3'>
        <div className='flex flex-col items-center text-center'>
          <h2>À venir !</h2>
          <p>Les marques disponibles dans notre pharmacie apparaîtront bientôt ici.</p>
          <p>Merci pour votre patience.</p>
        </div>
      </div>}
    </div>
  );
}

export default App;
