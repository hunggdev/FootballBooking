export const authMe = async (req, res) => {
    try {
        const user = req.user; // lay tu middleware
        return res.status(200).json({
            user
        })

        return res.status(200).json({message: "Success"});
    } catch (error) {
        console.log('Lỗi khi gọi authMe:', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const test = async (req, res) => {
    return res.sendStatus(204);
}