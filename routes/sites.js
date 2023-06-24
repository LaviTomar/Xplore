const express = require('express');
const router = express.Router();
const catchAsync = require('../handleError/catchAsync');
const { siteSchema } = require('../joiSchemas.js');
const { isLoggedIn, isAuthor, validateSite } = require('../middleware');

const ExpressError = require('../handleError/ExpressError');
const adventureSites = require('../models/sites');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const sites = require('../controllers/sites');

router.route('/')
    .get(catchAsync(sites.index))
    .post(isLoggedIn,upload.array('image'),validateSite, catchAsync(sites.createSite))
    // .post(isLoggedIn, upload.array('image'), (req,res)=>{
    //     console.log(req.body,req.files);
    //     res.send("IT WORKED?")
    // })

router.get('/new',isLoggedIn, sites.renderNewForm)
router.get('/map', catchAsync(sites.map))

router.route('/:id')
    .get(catchAsync(sites.showSite))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateSite,catchAsync(sites.updateSite))
    .delete(isLoggedIn, isAuthor, catchAsync(sites.deleteSite));


router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(sites.renderEditForm))



module.exports = router;



// title: 'RiverRafting',
// location: 'Nainital',
// price: '500',
// description: 'Theek'
// }
// } [
// {
// fieldname: 'image',
// originalname: 'one.jpg',
// encoding: '7bit',
// mimetype: 'image/jpeg',
// path: 'https://res.cloudinary.com/djud9fq8h/image/upload/v1686807460/Xplore/cgv3dzcfwbbn55nfyb8s.jpg',
// size: 666595,
// filename: 'Xplore/cgv3dzcfwbbn55nfyb8s'
// }
// ]