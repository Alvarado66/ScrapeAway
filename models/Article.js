var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },

  summary: {
    type: String,
    required: true
  },  
  notes: 

    [{type: Schema.Types.ObjectId, 
    ref: "Note"
    }]

  ,
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;  