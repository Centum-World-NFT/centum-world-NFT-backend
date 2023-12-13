

exports.testing = async (req, res) => {
    try {
        console.log(req.body);
        res.send("testing");
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
