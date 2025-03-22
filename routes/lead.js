const express = require('express')
const route = express.Router();
const {verify} = require('../middleware/auth')
const LeadController = require('../controllers/lead')
// Routes
route.post("/",verify,LeadController.createLead);
route.get("/",verify, LeadController.getAllLeads);
route.get("/:id",verify, LeadController.getLeadById);
route.put("/:id",verify, LeadController.updateLead);
route.delete("/:id",verify, LeadController.deleteLead);

module.exports = route;