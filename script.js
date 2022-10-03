const input = document.querySelector('.autocomplete-form__input');
const selectedRepo = document.querySelector('.selected-repo');

const debounce = (fn, debounceTime) => {
  let timeout;

  return function() {
    const fnCall = () => { fn.apply(this, arguments); }
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  }
};

function removeAutoComplete() {
  let items = document.querySelectorAll(".autocomplete-form__list-items");
  items.forEach(item => item.remove());
}

async function getRepositories(query) {
  return await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
    .then(responce => responce.json())
    .then(data => data.items);
}

function addRepoCard(repo) {
  selectedRepo.insertAdjacentHTML('beforeend', 
    `<div class="selected-repo__card">
      <ul class="selected-repo__card-list">
        <li class="selected-repo__card-list-item">Name: ${repo.name}</li>
        <li class="selected-repo__card-list-item">Owner: ${repo.owner.login}</li>
        <li class="selected-repo__card-list-item">Stars: ${repo.stargazers_count}</li>
      </ul>
    <button class="selected-repo__card-delete"></button>
    </div>`
  );
  removeAutoComplete();
  input.value = '';
}

function handleInput(e) {
  removeAutoComplete();

  if (input.value != '') {
    let repositories = [];

    getRepositories(input.value)
    .then(data => {
      for (let item of data) {
        let listItem = document.createElement("li");
        listItem.classList.add("autocomplete-form__list-items");
        listItem.addEventListener('click', () => addRepoCard(item));
        listItem.innerText = item.name;
        document.querySelector(".autocomplete-form__list").appendChild(listItem);
      }  
    });
  }
}

input.addEventListener('keyup', debounce(handleInput, 500));

selectedRepo.addEventListener('click', (e) => {
  let target = e.target;
  if (target.tagName != 'BUTTON') return; 
  target.parentNode.remove();
});
