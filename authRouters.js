const Router = require('express')
const router = new Router()
const config = require('./config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const Rating = require('./models/Rating');
const User = require('./models/User');
const Subject = require('./models/Subject');
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
        const { studentName, date, ratings } = req.body;

        const rating = await Rating.findOne({ studentName, date });

        if (rating) {
            ratings.forEach(subjectRating => {
                const subject = rating.subjects.find(sub => sub.name === subjectRating.subject);
                if (subject) {
                    subject.ratings = subjectRating.ratings;
                } else {
                    rating.subjects.push({
                        name: subjectRating.subject,
                        ratings: subjectRating.ratings
                    });
                }
            });

            await rating.save();
        } else {
            const newRating = new Rating({
                date,
                studentName,
                subjects: ratings.map(subjectRating => ({
                    name: subjectRating.subject,
                    ratings: subjectRating.ratings
                }))
            });

            await newRating.save();
        }

        res.json({ message: 'Оцінки успішно додані' });
    } catch (error) {
        console.error('Помилка при додаванні оцінок:', error);
        res.status(500).json({ message: 'Помилка при додаванні оцінок' });
    }
});

router.post('/listSTUDENT', async (req, res) => {
    try {
      const { username } = req.body;
      let usersQuery = User.find({ roles: 'STUDENT' });
      if (username) {
        usersQuery = usersQuery.where('username').equals(username);
      }
      const users = await usersQuery.exec();

      if (!users.length) {
        return res.status(404).json({ message: 'Студентів не знайдено' });
      }

      const studentData = users.map(user => {
        const subjects = Object.keys(user.grades || {});

        return {
          username: user.username,
          subjects
        };
      });
  
      res.json(studentData);
    } catch (error) {
      console.error('Помилка при отриманні списку студентів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку студентів' });
    }
});

router.post('/listTEACHER', async (req, res) => {
    try {
      const { username } = req.body;
      let usersQuery = User.find({ roles: 'TEACHER' });
      if (username) {
        usersQuery = usersQuery.where('username').equals(username);
      }

      const users = await usersQuery.exec();
  
      if (!users.length) {
        return res.status(404).json({ message: 'Вчителя не знайдено' });
      }

      const teacherData = users.map(user => {
        const subjects = Object.keys(user.grades || {});
  
        return {
          username: user.username,
          subjects
        };
      });
  
      res.json(teacherData);
    } catch (error) {
      console.error('Помилка при отриманні списку користувачів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку користувачів' });
    }
  });
  
router.post('/personalCabinet', async (req, res) => {
    try {
        const { username } = req.body;

        const ratings = await Rating.find({ studentName: username });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'Оцінок користувача не знайдено' });
        }

        const progress = ratings.map(rating => ({
            date: rating.date,
            subjects: rating.subjects.map(subject => ({
                name: subject.name,
                ratings: subject.ratings
            }))
        }));

        res.json({ progress });
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

// Перегляд придметів 
router.get('/subjects', async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.json(subjects);
    } catch (error) {
      console.error('Помилка при отриманні списку предметів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку предметів' });
    }
});

// Додавання придметів
router.post('/subjects', async (req, res) => {
    try {
      const { name } = req.body;
      const subject = new Subject({ name });
      await subject.save();
      res.status(201).json({ message: 'Предмет успішно додано', subject });
    } catch (error) {
      console.error('Помилка при додаванні предмету:', error);
      res.status(500).json({ message: 'Помилка при додаванні предмету' });
    }
  });

// Видалення предмету
router.delete('/subjects', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Не вказано ім\'я предмету' });
      }
      const deletedSubject = await Subject.findOneAndDelete({ name });
      if (!deletedSubject) {
        return res.status(404).json({ message: 'Предмет не знайдено' });
      }
      res.json({ message: 'Предмет успішно видалено', deletedSubject });
    } catch (error) {
      console.error('Помилка при видаленні предмету:', error);
      res.status(500).json({ message: 'Помилка при видаленні предмету' });
    }
});

// Створення розкладу
router.post('/subjects/schedule', async (req, res) => {
  try {
    const { name, day, time } = req.body;

    if (!name || !day || !time) {
      return res.status(400).json({ message: 'Name, day, and time are required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.schedule.push({ day, time });
    await subject.save();

    res.status(201).json({ message: 'Schedule entry added successfully', subject });
  } catch (error) {
    console.error('Error adding schedule entry:', error);
    res.status(500).json({ message: 'Error adding schedule entry' });
  }
});


// Видалення розкладу
router.delete('/subjects/schedule', async (req, res) => {
  try {
    const { name, day, time } = req.body;

    if (!name || !day || !time) {
      return res.status(400).json({ message: 'Name, day, and time are required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.schedule = subject.schedule.filter(entry => entry.day !== day || entry.time !== time);
    await subject.save();

    res.json({ message: 'Schedule entry removed successfully', subject });
  } catch (error) {
    console.error('Error removing schedule entry:', error);
    res.status(500).json({ message: 'Error removing schedule entry' });
  }
});

// Отримати розклад
router.get('/subjects/schedule', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject.schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ message: 'Error getting schedule' });
  }
});

module.exports = router