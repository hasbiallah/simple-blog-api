const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { pool } = require('../database/mysql_connection');

// Infrastructure
const PasswordHasher = require('../security/PasswordHasher');
const TokenManager = require('../security/TokenManager');

// Repositories
const UserRepositoryMySQL = require('../../adapters/repositories/UserRepositoryMySQL');
const ArticleRepositoryMySQL = require('../../adapters/repositories/ArticleRepositoryMySQL');
const CommentRepositoryMySQL = require('../../adapters/repositories/CommentRepositoryMySQL');

// Use Cases
const RegisterUser = require('../../use_cases/auth/RegisterUser');
const LoginUser = require('../../use_cases/auth/LoginUser');
const CreateArticle = require('../../use_cases/article/CreateArticle');
const GetArticles = require('../../use_cases/article/GetArticles');
const GetArticleDetail = require('../../use_cases/article/GetArticleDetail');
const UpdateArticle = require('../../use_cases/article/UpdateArticle');
const DeleteArticle = require('../../use_cases/article/DeleteArticle');

const CreateComment = require('../../use_cases/comment/CreateComment');
const DeleteComment = require('../../use_cases/comment/DeleteComment');

// Controllers
const AuthController = require('../../adapters/controllers/AuthController');
const ArticleController = require('../../adapters/controllers/ArticleController');
const CommentController = require('../../adapters/controllers/CommentController');

// Routes
const createAuthRoutes = require('./routes/authRoutes');
const createArticleRoutes = require('./routes/articleRoutes');
const createCommentRoutes = require('./routes/commentRoutes');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Dependency Injection
  const userRepository = new UserRepositoryMySQL(pool);
  const articleRepository = new ArticleRepositoryMySQL(pool);
  const commentRepository = new CommentRepositoryMySQL(pool);
  
  const passwordHasher = new PasswordHasher();
  const tokenManager = new TokenManager();

  // Auth
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const loginUser = new LoginUser(userRepository, passwordHasher, tokenManager);
  const authController = new AuthController(registerUser, loginUser);

  // Comment
  const createComment = new CreateComment(commentRepository, articleRepository);
  const deleteComment = new DeleteComment(commentRepository);
  const commentController = new CommentController(createComment, deleteComment);

  // Article
  const articleUseCases = {
    createArticle: new CreateArticle(articleRepository),
    getArticles: new GetArticles(articleRepository),
    getArticleDetail: new GetArticleDetail(articleRepository, commentRepository, userRepository),
    updateArticle: new UpdateArticle(articleRepository),
    deleteArticle: new DeleteArticle(articleRepository)
  };
  const articleController = new ArticleController(articleUseCases);

  // Routes
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/articles', createArticleRoutes(articleController, commentController));
  app.use('/api/comments', createCommentRoutes(commentController));

  // Root route
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Simple Blog API is running',
      version: '1.0.0'
    });
  });

  return app;
};

module.exports = createApp;
