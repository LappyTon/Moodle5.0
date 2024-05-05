const Router = require('express')
const router = new Router()
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration', [
    check('username', "імя не може бути пустим").notEmpty(),
    check('password', "Пароль повинен бути більше 4 і менше 10 символів").isLength({min:4, max:10})
], controller.registration)

router.post('/login', controller.login)

router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)
router.post('/addRating', async (req, res) => {
    try {
        const { username, subjectId, rating } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        if (!user.grades) {
            user.grades = {};
        }

        if (!user.grades[subjectId]) {
            user.grades[subjectId] = [];
        }

        user.grades[subjectId].push(rating);

        await user.save();

        res.json({ message: 'Оцінка успішно додана' });
    } catch (error) {
        console.error('Помилка при додаванні оцінки:', error);
        res.status(500).json({ message: 'Помилка при додаванні оцінки' });
    }
});


router.get('/listUsers', async (req, res) => {
    try {
        const users = await User.find({ roles: 'USER' });
        res.json(users);
    } catch (error) {
        console.error('Помилка при отриманні списку користувачів:', error);
        res.status(500).json({ message: 'Помилка при отриманні списку користувачів' });
    }
});

router.post('/progress', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }

        res.json({ grades: user.grades });
    } catch (error) {
        console.error('Помилка при отриманні прогресу:', error);
        res.status(500).json({ message: 'Помилка при отриманні прогресу' });
    }
});

module.exports = router