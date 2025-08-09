const sequelize = require("../config/connection");
const { Post, Category } = require("../models");

const postData = require("./posts.json");
const categoryData = require("./categories.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Category.bulkCreate(categoryData);

  const categories = await Category.findAll();

  const categoryMap = {};
  categories.forEach((cat) => {
    categoryMap[cat.category_name] = cat.id;
  });

  const cleanPosts = postData.map((post) => {
    const categoryName = post.category || post["category:"];
    const categoryId = categoryMap[categoryName] || null;

    return {
      title: post.title,
      content: post.content,
      postedBy: post.postedBy,
      categoryId,
      createdOn: post.createdOn,
    };
  });

  await Post.bulkCreate(cleanPosts);

  console.log("Database seeded!");
  process.exit(0);
};

seedDatabase();
