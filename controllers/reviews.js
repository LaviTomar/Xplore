const adventureSites = require('../models/sites');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const site = await adventureSites.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    site.reviews.push(review);
    await review.save();
    await site.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/adventureSite/${site._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await adventureSites.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/adventureSite/${id}`);
}