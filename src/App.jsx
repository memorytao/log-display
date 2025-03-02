import Header from "./headers/Header";
import SearchCriteria from "./search/SearchCriteria";

function App() {
  return (
    <div className="w-full md:w-auto place-content-start p-5 h-10">
      <Header />
      <SearchCriteria />
    </div>
  );
}

export default App;
