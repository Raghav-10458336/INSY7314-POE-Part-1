const Gig = require('../models/Gig')
const { ApiError } = require('../middleware/errorHandler')

async function getAllGigs(req, res, next) {
    try {
        const gigs = await Gig.find({ active: true }).sort({ createdAt: -1 })

        res.status(200).json({
            count: gigs.length,
            gigs
        })
    } catch (err) {
        next(err)
    }
}

async function getMyGigs(req, res, next) {
    try {
        const gigs = await Gig.find({
            freelancer: req.user.id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            count: gigs.length,
            gigs
        })
    } catch (err) {
        next(err)
    }
}

async function createGig(req, res, next) {
    try {
        const {
            title,
            description,
            category,
            price,
            deliveryDays,
            active
        } = req.body

        const gig = await Gig.create({
            title,
            description,
            category,
            price,
            deliveryDays,
            active,
            freelancer: req.user.id
        })

        res.status(201).json({
            message: 'gig created successfully',
            gig
        })
    } catch (err) {
        next(err)
    }
}

async function updateGig(req, res, next) {
    try {
        const {
            title,
            description,
            category,
            price,
            deliveryDays,
            active
        } = req.body

        const gig = await Gig.findOneAndUpdate(
            {
                _id: req.params.id,
                freelancer: req.user.id
            },
            {
                title,
                description,
                category,
                price,
                deliveryDays,
                active
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!gig) {
            throw new ApiError(404, 'gig not found or access denied')
        }

        res.status(200).json({
            message: 'gig updated successfully',
            gig
        })
    } catch (err) {
        next(err)
    }
}

async function deleteGig(req, res, next) {
    try {
        const gig = await Gig.findOneAndDelete({
            _id: req.params.id,
            freelancer: req.user.id
        })

        if (!gig) {
            throw new ApiError(404, 'gig not found or access denied')
        }

        res.status(200).json({
            message: 'gig deleted successfully'
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllGigs,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig
}
