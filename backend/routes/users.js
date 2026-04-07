import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

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
 *                lastName:
 *                  type: string
 *     responses:
 *       201:
 *         description: Utilisateur ajouté
 *       500:
 *         description: Erreur serveur
 *      400:
 *          description: Email déjà utilisé
 */

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
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
 *   post:
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
 *         description : Utilisateur introuvable
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
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
