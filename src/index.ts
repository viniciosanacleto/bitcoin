import { API } from "./infrastructure/api/index";
import dotenv from "dotenv";

dotenv.config();

const httpApi = new API();
httpApi.run(3000);
