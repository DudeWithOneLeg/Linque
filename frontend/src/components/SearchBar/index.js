import "./index.css";

export default function SearchBar({ setSearchTerm }) {
  return (
    <div id="search-bar">
      <div id="search-bar-container">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search-bar-input"
        />
        <img src="/images/icons/search.png" id="search-icon" />
      </div>
    </div>
  );
}
