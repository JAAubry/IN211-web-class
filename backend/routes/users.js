import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});



/**
 * @swagger
 * /api/users/new:
 *   post:
 *     summary: Ajouter un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur ajouté
 *       500:
 *         description: Erreur serveur
 *       400:
 *         description: Email déjà utilisé
 */

router.post('/new', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  console.log(req.body);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: await bcrypt.hash(req.body.password,10)
  });

  userRepository
    .insert(newUser)
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function (err) {
      console.log(err)
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Se connecter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', function (req, res) {
  const { email, password } = req.body;

  const userRepository = appDataSource.getRepository(User);

  userRepository.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return bcrypt.compare(password, user.password)
        .then(isValid => {
          if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
          console.log(process.env.JWT_SECRET)
          const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
          })
          return res.json({ token })
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error while logging in' });
    });
});


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *       401:
 *         description: Non autorisé (token invalide ou absent)
 *       500:
 *         description: Erreur serveur
 */
router.get("/me",authMiddleware, (req,res) => {
res.send(req.user);
});

export default router;
