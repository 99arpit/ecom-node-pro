export const testController = (req, res) => {
    res.status(200).send({
        message: "test  routes",
        success: true,
    });
};