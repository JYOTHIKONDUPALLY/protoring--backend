const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const moment = require("moment");
const User = require("../Models/User");
const { generateToken } = require("../Utils/tokenUtils");
const Assignment = require("../Models/assignments");
const FaceEvent = require("../Models/FaceEvent");
const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const currentTime = new Date();
        if (user.passwordExpiration && currentTime > user.passwordExpiration) {
            throw new Error("Your one-time password has expired.");
        }
//todo uncomment it
        // if (user.active) {
        //     throw new Error("User already logged in");
        // }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        user.active = true;
        user.loginTimestamps = new Date();
        await user.save();

        const token = generateToken({ id: user._id, role: "user" });

        return { token, user };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const logoutService = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    user.active = false;
    user.loginTimestamps.push(new Date());
    await user.save();

    return { message: "Logout successful" };
};

const registerService = async (candidates, role, assignmentId) => {
    const createdUsers = [];
    const existingUsers = [];
    const assignmentData = await Assignment.findOne({ _id: assignmentId });

    const expiryDate = assignmentData.endDate;

    if (!Array.isArray(candidates) || candidates.length === 0 || !role) {
        throw new Error("Emails (array) and role are required");
    }

    for (const candidate of candidates) {
        const { email, name, phoneNo, exp } = candidate;
        const randomPassword = crypto.randomBytes(8).toString("hex");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const lastLogin = existingUser.loginTimestamps;
            const appliedRole = existingUser.role;
            if (
                lastLogin &&
                moment().diff(moment(lastLogin), "months") < 6 &&
                appliedRole === role
            ) {
                existingUsers.push({
                    email: existingUser.email,
                    role: appliedRole,
                    applied_date: lastLogin,
                });
                continue;
            } else {
                Object.assign(existingUser, {
                    password: hashedPassword,
                    role,
                    active: false,
                    passwordExpiration: expiryDate,
                    loginTimestamps: null,
                    assignment: assignmentId,
                    name,
                    exp,
                    phone: phoneNo
                });
                await existingUser.save();
                createdUsers.push({
                    email: existingUser.email,
                    oneTimePassword: randomPassword,
                });
            }
        } else {
            const newUser = new User({
                email,
                role,
                password: hashedPassword,
                active: false,
                accessRole: "user",
                passwordExpiration: expiryDate,
                assignment: assignmentId,
                name,
                exp,
                phone: phoneNo
            });
            await newUser.save();
            createdUsers.push({
                email,
                oneTimePassword: randomPassword,
            });
        }
    }

    if (createdUsers.length === 0) {
        throw new Error("No new users were created. All provided emails already exist.");
    }

    return { createdUsers, existingUsers };
};

const saveImage = async (userId, image, timestamps, warning) => {
    try {
        console.log(timestamps);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const data={
            image: image,
            timestamps: timestamps,
            warning: warning
        }
        const faceEvent =await FaceEvent.findOne({userId: userId})
        if(!faceEvent){
            const newFaceEvent = new FaceEvent({
                userId: userId,
                status: warning,
                images: [data],
              });
              await newFaceEvent.save();
        }else{
            faceEvent.status = warning;
            faceEvent.images.push(data);

            await faceEvent.save();
        }
        return { message: "Image saved successfully" };
    }catch(error){
    return { message: error.message };
    }
}
module.exports = { loginService, logoutService, registerService,saveImage };
