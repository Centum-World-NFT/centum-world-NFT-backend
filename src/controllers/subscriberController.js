 
const Subscriber = require("../models/subscriberModel")
const Creator = require("../models/creatorModel")

exports.createSubscriber = async (req, res) => {
    try {
      const { firstName, lastName, subscribe, price, joiningDate, creatorId } =
        req.body;
  
      const existingCreator = await Creator.findById(creatorId);
      if (!existingCreator) {
        return res
          .status(404)
          .json({ status: false, message: "Creator not found." });
      }
  
      // Assuming you have a Subscriber model/schema
      const newSubscriber = new Subscriber({
        firstName,
        lastName,
        subscribe,
        price,
        joiningDate,
        creatorId,
      });
  
      // Save the new subscriber to the database
      const savedSubscriber = await newSubscriber.save();
  
      res.status(201).json(savedSubscriber);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.fetchSubscriber = async (req, res) => {
    try {
      const { creatorId } = req.body;
  
      const existingCreator = await Creator.findById(creatorId);
      if (!existingCreator) {
        return res
          .status(404)
          .json({ status: false, message: "Creator not found." });
      }
  
      // Fetch subscribers associated with the specified creatorId
      const subscribers = await Subscriber.find({ creatorId });
  
      res.status(200).json({ status: true, data: subscribers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
  
  exports.blockAndUnblockSubscriber = async (req, res) => {
    try {
      const { subscriberId, block } = req.body;
  
      // Find the subscriber by ID
      const subscriber = await Subscriber.findById(subscriberId);
  
      if (!subscriber) {
        return res
          .status(404)
          .json({ status: false, message: "Subscriber not found." });
      }
  
      // Update the 'isBlocked' field based on the 'block' value
      subscriber.isBlocked = block;
  
      // Save the updated subscriber
      const updatedSubscriber = await subscriber.save();
  
      // Send a response with a customized message
      const actionMessage = block ? "Subscriber blocked" : "Subscriber unblocked";
  
      res
        .status(200)
        .json({ status: true, message: actionMessage, data: updatedSubscriber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
  
  exports.fetchSubscriberByFilter = async (req, res) => {
    try {
      const { subscribe } = req.body;
  
      const subscriber = await Subscriber.find({ subscribe: subscribe });
      if (!subscriber) {
        return res
          .status(404)
          .json({ status: false, message: "No subscriber found" });
      }
  
      return res.status(200).json({
        status: true,
        message: "subscriber fetched successfully",
        data: subscriber,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
  