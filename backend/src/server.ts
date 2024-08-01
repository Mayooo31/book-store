import app from ".";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT!;

app.listen(PORT, () => console.log(`App is running on port ${PORT}. 😎`));
