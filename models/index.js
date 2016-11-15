'use strict'

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  // if we don't want to print the SQL command text of each query
  logging: false
});

// each definition has 3 object arguments:
// 1. 'user', 'page', etc.
// 2. defines the schema (name, email, title, etc.)
// 3. optional - options - hooks, virtuals, instance methods, class methods, etc.

const Page = db.define('page', {
  title: { type: Sequelize.STRING, allowNull: false },
  urlTitle: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
  status: { type: Sequelize.ENUM('open', 'closed') },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    defaultValue: [],
    set: function(tags) {
      tags = tags || [];
      // don't want to do anythign with it if it's already an array
      if (typeof tags === 'string') {
        tags = tags.split(',').map(function(str) {
          return str.trim();
        })
      }
      // can't use this.tags = tags here because that will trigger this function to be called again
      // and will wind up in an infinite loop
      // setDataValue is a built in method to prevent that
      this.setDataValue('tags', tags);
    }
  }
}, {
    // virtual field - why:
    // when you want to have a property on your instance where we want to be able to say, let's go get that value off of the page, but it's always derived from other information on the page
    // because it's always derived, we don't need to store it -> would be redundant information
    // but if we always just created a res.redirect('/wiki/' + page.urlTitle), it'd be super repetitive
    // funky thing is how we use them: we don't call them, we just use them like regular properties
    getterMethods: {
      route: function() {
        return '/wiki/' + this.urlTitle;
      }
    },
    hooks: {
      beforeValidate: function(page) {
        if (page.title) {
          page.urlTitle = page.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
          // last part can also be (/\W/g, '') - just delete all whitespace
        } else {
          page.urlTitle = Math.random().toString(36).substring(2, 7);
        }
      }
    }
  }
)

const User = db.define('user', {
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, isEmail: true, unique: true }
    // inside of email object: validate: { isEmail: true } vs. what we have here?
})

Page.belongsTo(User, { as: 'author' });
// this is going to a whole bunch of stuff:
// 1. changes schema, so { force: true } in syncs to drop and re-add tables to reflect changes
// but remember to undo right after!!!
// 2. Sequelize places instance methods on our page objects in order to manage the association btwn Page & User

module.exports = {
  Page: Page,
  User: User
}
