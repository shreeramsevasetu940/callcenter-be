const Lead = require("../models/lead.js");

const LeadController = {
    // Create Lead
    async createLead(req, res) {
        try {
            const staffId = req.user.id
            const lead = new Lead({...req.body,staffId});
            await lead.save();
            res.status(201).json(lead);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Read all Leads
    async getAllLeads(req, res) {
        try {
            const { page = 1, limit = 25, search = ""} = req.query;
            const pageNumber = parseInt(page, 25);
            const limitNumber = parseInt(limit, 25);
            // Search query
            const searchQuery = {
            ...(search && {
                $or: [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                ],
            })
            };

            // Fetch total count for pagination
            const totalRecords = await Lead.countDocuments(searchQuery);
        
            // Fetch paginated lead data
            const leadList = await Lead.find(searchQuery)
              .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        
            res.status(200).json({
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNumber),
            currentPage: pageNumber,
            pageSize: limitNumber,
            leadList,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Read a single Lead
    async getLeadById(req, res) {
        try {
            const lead = await Lead.findById(req.params.id).populate("staffId");
            if (!lead) {
                return res.status(404).json({ error: "Lead not found" });
            }
            res.status(200).json(lead);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update Lead
    async updateLead(req, res) {
        try {
            const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!lead) {
                return res.status(404).json({ error: "Lead not found" });
            }
            res.status(200).json(lead);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete Lead
    async deleteLead(req, res) {
        try {
            const lead = await Lead.findByIdAndDelete(req.params.id);
            if (!lead) {
                return res.status(404).json({ error: "Lead not found" });
            }
            res.status(200).json({ message: "Lead deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = LeadController;