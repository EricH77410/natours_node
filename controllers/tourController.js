const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/APIFeatures')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async (req, res) => {
    try {
        // Execution de la requete
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const tours = await features.query

        // Envoi de la réponse
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {

    try {        
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }

}

exports.patchTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success', 
            data: { 
                tour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the requested tour'
        })
    }

}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
  
        res.status(204).json({
            status: 'success', 
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to delete the requested tour'
        })
    }


}

exports.getOneTour =  async (req, res) => {  
    try {
       const tour =  await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5} }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'}
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: { 
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                 }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStart: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields : { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStart: -1 }
            },
            {
                $limit: 12 // juste pour référence
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.test = async (req, res) => {
    // Je veux ajouter un champ avec la date de fin de sejour
    try {
        const test = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $addFields: { endDate:  { $add: ['$startDates',('$duration'*24*60*6000)] } }
            },
            {
                $limit: 1
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                test
            }
        })
        
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}