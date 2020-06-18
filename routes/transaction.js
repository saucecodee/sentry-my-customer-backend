const express = require('express')
const router = express.Router()
const Transaction = require('../models/transaction')

//#region GetAllTransactions GET
router.get('/all', async (res) => {
    try {
        const transactions = await Transaction.find()
        res.json(transactions)
        if(transaction==null){
            res.status(404).json({
    
                status: "No Transaction Found"
                })
        }
    }
    catch (err) {
        require.send('Error: ' + err)

    }
})
//#endregion

//#region CreateTransaction POST
router.post('/new', async (req, res) => {
    const transact = new Transaction({
        //DataType:number
        amount: req.body.amount,
         //DataType:number
        interest: req.body.interest,
         //DataType:number
        total_amount: req.body.total_amount,
         //DataType:String
        description: req.body.description
      
    })
    const store = await transact.save((err, success) => {
        res.send(store)
        if (err) {
            res.status(500).json({
                status: "fail",
                message: "Error establishing database connection"
            });
        } else if (success) {
            res.status(200).json({
                status:"Successfull",
                 message:transact.description + " Successfully created"
           });
        }
        else {
            res.status(503).json({
                status: "title or body cannot be empty"
            })
        }
    })
})
//#endregion

//#region GetTransactionById GET
router.get('/getById/:id', async (req, res) => {

    
    try{
        const transaction = await Transaction.findById(req.params.id)
        res.send(transaction)
        if(transaction==null){
        res.status(404).json({

            status: "Transaction Not Found"

        })
    }
    }
    catch(err){
        res.status(503).json({

            status: "title or body cannot be empty"

        })
   

      
        }
})
//#endregion

//#region UpdateTransaction PATCH
router.patch('/update/:transaction_id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
    
    //DataType:number
    transaction.amount=req.body.amount
    //DataType:number
    transaction.interest=req.body.interest
    //DataType:number
    transaction.total_amount=req.body.total_amount
    //DataType:String
    transaction.description=req.body.description
    
    const store = await transaction.save(err,success => {       
        if (err) {
            res.status(500).json({
                status: "fail",
                message: "Error establishing database connection"
            })
        }
       else if(transaction==null){
                res.status(404).json({
                       status: "Transaction Not Found"
                   })
            }
         else if (success) {
            res.status(200).json({
                status:"Successfully updated"
            })
        }
        else {
            res.status(503).json({
                status: "title or body cannot be empty"
            })
        }
 })
})
//#endregion

//#region DeleteTransaction DELETE
router.delete('/delete/:transaction_id', async (req, res) => {
    const transaction = await Transaction.findByIdAndRemove(req.params.id)
    const store = await transaction.remove(err,success => {
        if (success) {
            res.status(200).json({
                status: "Transaction has been deleted successfully"
            });
        }
        else if(transaction==null){
            res.status(404).json({
                status: "Transaction Not Found"
 
           })
        }
        else if(err){
            res.status(503).json({
                status: "No database connection established"
            })
        }
    })

})
//#endregion
module.exports = router