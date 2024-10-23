const express = require('express');
const router = express.Router();
const Email = require('../models/Email');  // Import the Email model

function updatedemails(req){
    return Email.findOneAndUpdate(
        {_id:req.params.id},
        {$set:req.body},
        {new:true}
    )
}

function deleteemail(req){
    return Email.findByIdAndDelete({
        _id:req.params.id,
    })
}


// Updated route for fetching all emails
router.get("/all", async (req, res) => {
    try {
      // Call the function to fetch all emails
      const emails = await Email.find().populate("user", "username email")
  
      // Check if no emails are found
      if (!emails || emails.length <= 0) {
        return res.status(400).json({ error: "No content available" });
      }
  
      // Respond with the fetched emails
      res.status(200).json({
        data: emails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  router.get('/user/all', async (req, res) => {
    try {
        // Ensure req.user is populated by your authentication middleware
        const allEmails = await Email.find({ user: req.user._id })
            .populate('user', 'username email'); // Populate user field with username and email

        if (!allEmails || allEmails.length <= 0) {
            return res.status(400).json({ error: "No content available" });
        }

        res.status(200).json({
            data: allEmails,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/user/send', async (req, res) => {
    const { recipient, subject, message } = req.body;
  
    // Input validation
    if (!recipient || !subject || !message) {
      return res.status(400).json({ error: 'Please provide recipient, subject, and message.' });
    }
  
    try {
      // Create a new email document
      const newEmail = new Email({
        recipient,
        subject,
        message,
        user: req.user._id  // Attach the logged-in user's ID
      });
  
      // Save the new email to the database
      await newEmail.save();
  
      // After saving, populate the user details in the response
      const populatedEmail = await newEmail.populate('user', 'username email');
  
      // Send the response with the populated email
      res.status(201).json({ message: 'Email sent successfully!', data: populatedEmail });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

router.put('/user/edit/:id', async(req,res)=>{
    try {
        const editemail=await updatedemails(req);
        if(!updatedemails){
            return res.status(400).json({error:"error while updating"})
        }
        res.status(200).json({
            message:"succesfully updated",
            data:editemail
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal server"})

    }
});


router.delete('/user/delete/:id', async(req,res)=>{
    try {
        const deleteEmail=await deleteemail(req);
        if(!deleteEmail){
            return res.status(400).json({error:"error while deleting"})
        }
        res.status(201).json({
            message:"succesfully deleted",
           
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal server"})

    }
});

const Emailrouter = router

module.exports = Emailrouter;
