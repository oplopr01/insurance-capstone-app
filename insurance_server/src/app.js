import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import reinsuranceRoutes from "./routes/reinsuranceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/policies', policyRoutes);

app.use('/api/claims', claimRoutes);

app.use('/api/reinsurance', reinsuranceRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send("Hello");
});

export default app;