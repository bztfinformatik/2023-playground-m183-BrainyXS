const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    'm153',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);
const User = sequelize.define('User', {
    username: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    email: DataTypes.STRING,
    profileImageUrl: DataTypes.STRING
});

const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
});

const Vote = sequelize.define('Vote', {
    isUpvote: DataTypes.BOOLEAN,
});

User.hasMany(Comment);
User.hasMany(Vote);
Comment.belongsTo(User);
Comment.hasMany(Vote);
Vote.belongsTo(Comment);
Vote.belongsTo(User);
Comment.hasOne(Comment, {
    foreignKey: {
        allowNull: true,
        name: "ParentCommentId"
    }
});

sequelize.sync({force: true});

module.exports = {
    User: User,
    Comment: Comment,
    Vote: Vote
}