const UserController = require("../controllers/userController");
const HeroController = require("../controllers/heroController");
const router = require("express").Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);

router.get("/hero", HeroController.getHeroes);
router.get("/role", HeroController.getHeroesByRole);
router.get("/specially", HeroController.getHeroesBySpecially);
router.get("/hero/:id", HeroController.getHeroById);

module.exports = router;
