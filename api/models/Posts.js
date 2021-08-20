module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        topic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cover: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Signatures, {
            onDelete: "cascade",
        });
    };

   
    return Posts;
}