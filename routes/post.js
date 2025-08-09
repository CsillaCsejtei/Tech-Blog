const app = require("express").Router();

const { Post, Category } = require("../models/index");

app.post("/", async (req, res) => {
  try {
    const { title, content, postedBy, categoryId} = req.body;
    const post = await Post.create({ title, content, postedBy, categoryId});

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error adding post" });
  }
});

app.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Category, attributes: ["category_name"], as: "category" },
      ],
    });

    const plainPosts = posts.map((post) => post.get({ plain: true }));

    res.json(plainPosts); 
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});



app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});

app.get("/category/:categoryName", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { category_name: req.params.categoryName },
      include: [{ model: Post, as: "posts" }],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category.posts);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts by category" });
  }
});


app.put("/:id", async (req, res) => {
  try {
    const { title, content, postedBy, categoryId} = req.body;
    const post = await Post.update(
      { title, content, postedBy, categoryId},
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});


app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

module.exports = app;
