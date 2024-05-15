const Router = require('express')
const router = new Router()
const config = require('./config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration', [
    check('username', "імя не може бути пустим").notEmpty(),
    check('password', "Пароль повинен бути більше 4 і менше 10 символів").isLength({min:4, max:10}),
    check('roles').optional().isIn(['CHIEF-TEACHER', 'TEACHER', 'STUDENT'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password, roles } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            password: hashedPassword,
            roles
        });
        await user.save();
        if (roles.includes('TEACHER')) {
            user.grades = [];
        }
        if (roles.includes('CHIEF-TEACHER')) {
            user.grades = [];
        }
        await user.save();

        return res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        console.error('Помилка при реєстрації користувача:', error);
        res.status(500).json({ message: 'Помилка при реєстрації користувача' });
    }
});
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["CHIEF-TEACHER"]), controller.getUsers)
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

router.post('/deleteSubject', async (req, res) => {
    try {
        const { username, subjectId } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        if (!user.grades[subjectId]) {
            return res.status(404).json({ message: 'Користувач не має такого предмету' });
        }
        await User.updateOne({ username }, { $unset: { [`grades.${subjectId}`]: '' } });
        res.json({ message: 'Предмет успішно видалено' });
    } catch (error) {
        console.error('Помилка при видаленні предмету:', error);
        res.status(500).json({ message: 'Помилка при видаленні предмету' });
    }
});

router.post('/addSubjectToTeacher', async (req, res) => {
    try {
        const { teacherName, subjectName } = req.body;
        const teacher = await User.findOne({ username: teacherName });
        if (!teacher) {
            return res.status(404).json({ message: 'Викладача не знайдено' });
        }
        teacher.grades = {};
        teacher.grades[subjectName] = [];
        await teacher.save();

        return res.json({ message: `Предмет ${subjectName} успішно додано до викладача` });
    } catch (error) {
        console.error('Помилка при додаванні предмета до вчителя:', error);
        res.status(500).json({ message: 'Помилка при додаванні предмета до вчителя' });
    }
});

router.post('/studentsBySubject', async (req, res) => {
    try {
        const { subject } = req.body;   
        const studentsQuery = { roles: 'STUDENT', [`grades.${subject}`]: { $exists: true } };
        const students = await User.find(studentsQuery);
        const studentNames = students.map(student => student.username);
        
        return res.json({ students: studentNames });
    } catch (error) {
        console.error('Помилка при отриманні списку студентів за предметом:', error);
        res.status(500).json({ message: 'Помилка при отриманні списку студентів за предметом' });
    }
});





module.exports = router