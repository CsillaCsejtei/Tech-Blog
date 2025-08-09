let token = localStorage.getItem("authToken");

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("https://tech-blog-8ynl.onrender.com/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("https://tech-blog-8ynl.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

        alert("User Logged In successfully");

        loadCategories();
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("https://tech-blog-8ynl.onrender.com/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function fetchPosts() {
  fetch("https://tech-blog-8ynl.onrender.com/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Response from /api/posts:", data);

      const posts = Array.isArray(data) ? data : data.posts;

      if (!Array.isArray(posts)) {
        console.error("Expected posts to be an array, got:", posts);
        return;
      }

      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";

      posts.forEach((post) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>
            By: ${post.postedBy}
            | Category: ${post.category?.category_name || "N/A"}
            | Posted on: ${new Date(post.createdOn).toLocaleString()}
          </small>
          <br>
          <button onclick="editPost(${post.id}, \`${post.title}\`, \`${
          post.content
        }\`)">Edit</button>
          <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsContainer.appendChild(div);
      });
    })
    .catch((err) => console.error("Error loading posts:", err));
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const categoryId = document.getElementById("categorySelect").value;

  fetch("https://tech-blog-8ynl.onrender.com/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, categoryId, postedBy: "User" }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      document.getElementById("post-title").value = "";
      document.getElementById("post-content").value = "";

      fetchPosts();
    });
}

function editPost(id, oldTitle, oldContent) {
  const title = prompt("Update title:", oldTitle);
  const content = prompt("Update content:", oldContent);

  if (title && content) {
    fetch(`https://tech-blog-8ynl.onrender.com/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Post updated successfully");
        fetchPosts();
      })
      .catch((err) => console.error(err));
  }
}

function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`https://tech-blog-8ynl.onrender.com/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        alert("Post deleted successfully");
        fetchPosts();
      })
      .catch((err) => console.error(err));
  }
}

async function loadCategories() {
  try {
    const response = await fetch(
      "https://tech-blog-8ynl.onrender.com/api/categories",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const categories = await response.json();

    const select = document.getElementById("categorySelect");
    const filter = document.getElementById("filterCategory");
    select.innerHTML = "";
    filter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach((category) => {
      const option1 = document.createElement("option");
      option1.value = category.id;
      option1.textContent = category.category_name;
      select.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = category.id;
      option2.textContent = category.category_name;
      filter.appendChild(option2);
    });
  } catch (error) {
    console.error("Failed to load categories", error);
  }
}
function filterPosts() {
  const selectedCategory = document.getElementById("filterCategory").value;

  fetch("https://tech-blog-8ynl.onrender.com/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      const filtered =
        selectedCategory === "all"
          ? posts
          : posts.filter((post) => post.categoryId == selectedCategory);

      filtered.forEach((post) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${post.title}</h3>
          <p><strong>Category:</strong> ${
            post.category?.category_name || "Unknown"
          }</p>
          <p>${post.content}</p>
          <small>By: ${post.postedBy} on ${new Date(
          post.createdOn
        ).toLocaleString()}</small>
          <br>
          <button onclick="editPost(${post.id}, \`${post.title}\`, \`${
          post.content
        }\`)">Edit</button>
          <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsContainer.appendChild(div);
      });
    });
}
