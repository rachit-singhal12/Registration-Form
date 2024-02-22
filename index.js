import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.gry3mib.mongodb.net/registrationFormDbs`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    state: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Assuming your static files are in a "public" folder

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmpass, phone, address, city, country, state } = req.body;

        const existingUser = await Registration.findOne({ email: email, phone: phone });
        if (password === confirmpass) {

            if (!existingUser) {
                const registrationData = new Registration({
                    name,
                    email,
                    password,
                    phone,
                    address,
                    city,
                    country,
                    state
                });
                await registrationData.save();

                res.redirect("/success");
            }
            else {
                console.log("User already exists");
                res.redirect("/error");
            }
        }
        else {
            console.log("Password not matched");
            res.redirect("/");
        }

    }
    catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "success.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "error.html"));
});

app.listen(port, () => {
    console.log(`Server running on port number: ${port}`);
});
