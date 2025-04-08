const bcrypt = require("bcrypt");
const Supplier = require("../Models/Supplier");
const StoreManager=require("../Models/StoreManager")
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password)
        return res.status(401).send({ error: true, message: "All fields are required", data: null });

    let foundUser = await Supplier.findOne({ representativeName:name});
    let role = "supplier";

    if (!foundUser) {
        foundUser = await StoreManager.findOne({ name });
        role = "storeManager";
    }

    if (!foundUser){
        return res.status(401).send({ error: true, message: "Unauthorized", data: null });
    }
       

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match){
        return res.status(401).send({ error: true, message: "Unauthorized", data: null });
    }
        

    const userDetails = {
        _id: foundUser._id,
        name: foundUser.name||foundUser.representativeName,
        email: foundUser.email,
        phone: foundUser.phoneNumber,
        role: role,
        company: foundUser.company || null,
        
    };

    const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN, {  expiresIn: '7d' });
    const refreshToken = jwt.sign({ name: foundUser.name, role }, process.env.REFRESH_TOKEN, { expiresIn: '1d' });
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ accessToken });
};


const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(401).send({ error: true, message: "Unauthorized", data: null });

    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN, async (err, decoded) => {
        if (err)
            return res.status(403).send({ error: true, message: "Forbidden", data: null });

        let foundUser;
        if (decoded.role === "supplier") {
            foundUser = await Supplier.findOne({ name: decoded.name });
        } else if (decoded.role === "storeManager") {
            foundUser = await StoreManager.findOne({ name: decoded.name });
        }

        if (!foundUser)
            return res.status(401).send({ error: true, message: "Unauthorized", data: null });

        const userDetails = {
            _id: foundUser._id,
            name: foundUser.name||foundUser.representativeName,
            email: foundUser.email,
            phone: foundUser.phoneNumber,
            role: decoded.role,
            company: foundUser.company || null,
        };

        const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN, { expiresIn: '30m' });

        res.json({ accessToken });
    });
};


const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(204).send({ error: false, message: "No Content", data: null });

    res.clearCookie("jwt", { httpOnly: true, secure: true });
    return res.json({ error: false, message: "Logged out successfully", data: null });
};

module.exports = { login, refresh, logout };
