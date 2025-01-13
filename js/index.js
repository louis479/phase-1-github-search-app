let searchType = "users";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle to Repo Search";
  document.body.insertBefore(toggleButton, form.nextSibling);

  toggleButton.addEventListener("click", () => {
    searchType = searchType === "users" ? "repos" : "users";
    toggleButton.textContent =
      searchType === "users" ? "Toggle to Repo Search" : "Toggle to User Search";
    form.querySelector("input").placeholder =
      searchType === "users"
        ? "Search GitHub Users"
        : "Search GitHub Repositories";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchValue = document.getElementById("search").value;

    if (searchType === "users") {
      searchGitHubUsers(searchValue);
    } else {
      searchGitHubRepos(searchValue);
    }
  });
});

function searchGitHubUsers(searchValue) {
  fetch(`https://api.github.com/search/users?q=${searchValue}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((data) => displayUsers(data.items));
}

function displayUsers(users) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  users.forEach((user) => {
    const userDiv = document.createElement("div");

    userDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50">
      <p><strong>${user.login}</strong></p>
      <a href="${user.html_url}" target="_blank">View Profile</a>
      <button data-username="${user.login}">View Repos</button>
    `;

    userDiv.querySelector("button").addEventListener("click", (event) => {
      fetchUserRepos(event.target.dataset.username);
    });

    userList.appendChild(userDiv);
  });
}

function fetchUserRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((repos) => displayRepos(repos));
}

function displayRepos(repos) {
  const reposList = document.getElementById("repos-list");
  reposList.innerHTML = "";

  repos.forEach((repo) => {
    const repoDiv = document.createElement("div");

    repoDiv.innerHTML = `
      <p><strong>${repo.name}</strong></p>
      <a href="${repo.html_url}" target="_blank">View Repository</a>
    `;

    reposList.appendChild(repoDiv);
  });
}

function searchGitHubRepos(searchValue) {
  fetch(`https://api.github.com/search/repositories?q=${searchValue}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((data) => displayRepos(data.items));
}
