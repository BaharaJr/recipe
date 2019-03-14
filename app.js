const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Recipe = require('./models/recipe');

//Creating an express app
const app = express();

//connecting express app with MongoDD atlas
mongoose.connect('mongodb+srv://noja:ti6LLDi5mKXr2Ph@cluster0-9geny.mongodb.net/test?retryWrites=truemongodb+srv://will:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });


//Headers to deal with CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//converting JS object into suitable form
app.use(bodyParser.json());

  //Create Route
  app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    recipe.save().then(
        () => {
            res.status(201).json(
                {message: 'Successful posted'}
            );
        }
    ).catch(
        (error) => {
            res.status(400).json(
                {error: error}
            );
        }
    );
  });

//GET route to retun individual recipe in the database
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({_id: req.params.id}).then(
        (recipe) => {
            res.status(200).json(recipe);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});  

//UPDATE route
app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    Recipe.updateOne({_id: req.params.id}, recipe).then(
      () => {
        res.status(201).json({
          message: 'Recipe updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

//DELETE route
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });


//GET route to return all of the Recipe in the database
app.get('/api/recipes', (req, res, next) => {
    Recipe.find().then(
      (recipes) => {
        res.status(200).json(recipes);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });


module.exports = app;