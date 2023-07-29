const adventureSites = require('../models/sites');
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const sites = await adventureSites.find({});
    res.render('Adventure/index', { sites })
}

module.exports.map = async (req, res) => {
    const sites = await adventureSites.find({});
    res.render('Adventure/map', { sites })
}


module.exports.renderNewForm = (req, res) => {
    res.render('Adventure/new');
}

module.exports.createSite = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.site.location,
        limit : 1
    }).send();
    const site = new adventureSites(req.body.site);
    site.geometry= geoData.body.features[0].geometry;
    site.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    site.author = req.user._id;
    await site.save();  
    req.flash('success', 'Successfully made a new site!');
    res.redirect(`/adventureSite/${site._id}`)
}

module.exports.showSite = async (req, res) => {
    const site = await adventureSites.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(site);
    if (!site) {
        req.flash('error', 'Cannot find that site!');
        return res.redirect('/adventureSite');
    }
    res.render('Adventure/show', { site});
}

module.exports.renderEditForm = async (req, res) => {
    const site = await adventureSites.findById(req.params.id)
    if (!site) {
        req.flash('error', 'Cannot find that site!');
        return res.redirect('/adventureSite');
    }
    res.render('Adventure/edit', { site });
}

module.exports.updateSite = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const site = await adventureSites.findByIdAndUpdate(id, { ...req.body.site });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    site.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await site.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await site.save();
    req.flash('success', 'Successfully updated site!');
    res.redirect(`/adventureSite/${site._id}`)
}
module.exports.deleteSite = async (req, res) => {
    const { id } = req.params;
    await adventureSites.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted site!');
    res.redirect('/adventureSite');
}
