const input = document.querySelector('.autocomplete-form__input');
const autoComplete = document.querySelector('.autocomplete-form__list');
const selectedRepo = document.querySelector('.selected-repo');

const debounce = (fn, debounceTime) => {
  let timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(()=>fn(), debounceTime);
  }
};

async function getRepositories(query) {
  let response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
   
  if (response.status == 200) {
    let data = await response.json();
    return data.items;   
  }

  throw new Error(response.status);
}

function addRepoCard(repo) {
  selectedRepo.insertAdjacentHTML('beforeend', 
    `<div class="selected-repo__card">
      <pre class="selected-repo__card-list">
        Name: ${repo.name}
        Owner: ${repo.owner.login}
        Stars: ${repo.stargazers_count}
      </pre>
      <button class="selected-repo__card-delete"></button>
    </div>`
  );
  autoComplete.replaceChildren();
  input.value = '';
}

function handleInput(e) {
  autoComplete.replaceChildren();

  if (input.value === '') return;

  getRepositories(input.value)
    .then(data => { 
      data.forEach(item => {
        let listItem = document.createElement("li");
        let listItemBtn = document.createElement("button");
        listItemBtn.classList.add("autocomplete-form__list-item-btn");
        listItemBtn.addEventListener('click', () => addRepoCard(item));
        listItemBtn.innerText = item.name;
        listItem.appendChild(listItemBtn);
        autoComplete.appendChild(listItem);       
      });
    });
}

input.addEventListener('keyup', debounce(handleInput, 500));

selectedRepo.addEventListener('click', (e) => {
  let target = e.target;
  if (target.tagName != 'BUTTON') return; 
  target.parentNode.remove();
});
