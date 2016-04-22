var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');



var userSchema = new mongoose.Schema({

  userId: {
    type: String,
    unique: true,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },

  firstName: String,
  lastName: String,
  password: String,
  email: String,
  adddress: String,
  contactNumber: Number

});


var admin = userSchema.extend({

});

var student = userSchema.extend({

    dob: Date,
    gender: String,
    alStream: String,
    zScore: Number,
    Department: Number,
    registeredDate: Date,
    profileImage: String,
    subjects:[String]

});


var coordinator = userSchema.extend({

    Department: Number,
    subjects:[String]

});



// mongoose.model('user', userSchema);
mongoose.model('admin',admin );
mongoose.model('student',student );
mongoose.model('coordinator',coordinator );


// // Execute before each user.save() call
// userSchema.pre('save', function(callback) {
//   var user = this;
//
//   // Break out if the password hasn't changed
//   if (!user.isModified('password')) return callback();
//
//   // Password changed so we need to hash it
//   console.log("Encrypt password");
//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return callback(err);
//
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return callback(err);
//       user.password = hash;
//       callback();
//     });
//   });
// });


// // Execute before each user.findOneAndUpdate() call
// userSchema.pre('findOneAndUpdate', function(callback) {
//   var user = this;
//   console.log('findOneAndUpdate ' + user.getQuery() );
//   // Break out if the password hasn't changed
//   if (!user.isModified('password')) return callback();
//
//   // Password changed so we need to hash it
//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return callback(err);
//
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return callback(err);
//       user.password = hash;
//       callback();
//     });
//   });
// });


// //verify Password
// userSchema.methods.verifyPassword = function(password, cb) {
//   bcrypt.compare(password, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };
//
//
// userSchema.methods.findByUserID = function (cb) {
//   return this.model('user_model').findOne({userId: this.userId}, cb);
// };
