var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

var User = db.define('user', {
  name: {type: Sequelize.STRING, allowNull: false},
  email: {type: Sequelize.STRING, allowNull: false, isEmail: true, unique: true}
});

var Page = db.define('page', {
  title: {type: Sequelize.STRING, allowNull: false},
  urlTitle: {type: Sequelize.STRING, allowNull: false, unique: true},
  content: {type: Sequelize.TEXT, allowNull: false},
  status: {type: Sequelize.ENUM('open', 'closed')},
  date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
}, {
    getterMethods: {
      route: function() { return '/wiki/' + this.urlTitle }
    },
    hooks: {
      beforeValidate: function(page, options) {
        if (page.title) {
          page.urlTitle = page.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, "");
        } else {
          page.urlTitle = Math.random().toString(36).substring(2, 7);
        }
      }
    }
  });

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
