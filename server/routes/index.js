const UserController = require("../controllers/userController");
const HeroController = require("../controllers/heroController");
const GeminiController = require("../controllers/geminiController");
const FavoriteController = require("../controllers/favoriteController");
const router = require("express").Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/authgoogle", UserController.googleLogin); // Add this new route to match frontend request

router.get("/favorite", FavoriteController.getFavorite);
router.put("/favorite/:id", FavoriteController.editFavorite);
router.delete("/favorite/:id", FavoriteController.deleteFavorite);

router.get("/hero", HeroController.getHeroes);
router.get("/role", HeroController.getHeroesByRole);
router.get("/specially", HeroController.getHeroesBySpecially);
router.get("/hero/:id", HeroController.getHeroById);
router.post("/hero", HeroController.addHero);
router.put("/hero/:id", HeroController.updateHero);
router.delete("/hero/:id", HeroController.deleteHero);

router.post("/gemini/generate", GeminiController.generateAIContent);

module.exports = router;
