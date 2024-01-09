const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true, min: 6, max: 64 },
    picture: { type: String, default: "https://picsum.photos/seed/picsum/200/300" },
    role: { type: [String], default: ["Subscriber"], enum: ["Subscriber", "Instructor", "Admin"] },
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    addToCart: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    WishList: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    Stripe_account_id: String,
    Stripe_Seller: {},
    StripeSession: {}
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
