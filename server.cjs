var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
function cleanVal(val) {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}
function format10DigitPhone(phone) {
  if (!phone) return "";
  const digitsOnly = phone.toString().replace(/\D/g, "");
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
}
function getTwoFactorApiKey() {
  let apiKey = cleanVal(process.env.TWOFACTOR_API_KEY) || cleanVal(process.env.TWOFACTOR_SMS_API_KEY);
  if (!apiKey || apiKey.includes("your_2factor") || apiKey.includes("XXXX")) {
    try {
      const envPath = import_fs.default.existsSync(import_path.default.join(process.cwd(), ".env")) ? import_path.default.join(process.cwd(), ".env") : import_fs.default.existsSync(import_path.default.join(process.cwd(), ".env.example")) ? import_path.default.join(process.cwd(), ".env.example") : null;
      if (envPath) {
        const envContent = import_fs.default.readFileSync(envPath, "utf-8");
        const match = envContent.match(/(?:TWOFACTOR_API_KEY|TWOFACTOR_SMS_API_KEY)\s*=\s*(.*)/);
        if (match && match[1]) {
          const found = cleanVal(match[1]);
          if (found && !found.includes("XXXX")) {
            apiKey = found;
          }
        }
      }
    } catch (e) {
      console.error("Error reading env files for 2Factor.in API Key:", e);
    }
  }
  return cleanVal(apiKey);
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3001;
  app.use(import_express.default.json());
  const getStatusHandler = (req, res) => {
    const apiKey = getTwoFactorApiKey();
    const isConfigured = !!(apiKey && apiKey.length >= 8);
    res.json({
      configured: isConfigured,
      hasApiKey: isConfigured,
      apiKeyMasked: isConfigured ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : null,
      provider: "2Factor.in"
    });
  };
  app.get("/api/2factor-status", getStatusHandler);
  app.get("/api/sms-status", getStatusHandler);
  app.get("/api/fast2sms-status", getStatusHandler);
  app.get("/api/twilio-status", getStatusHandler);
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { mobileNumber, otpCode, purpose, customApiKey } = req.body;
      if (!mobileNumber) {
        return res.status(400).json({ success: false, error: "Mobile number is required" });
      }
      const target10DigitPhone = format10DigitPhone(mobileNumber);
      if (target10DigitPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          error: "Valid 10-digit mobile number required for 2Factor.in OTP dispatch"
        });
      }
      const apiKey = cleanVal(customApiKey) || getTwoFactorApiKey();
      if (apiKey && apiKey.length >= 8) {
        console.log(`[2Factor.in Dispatching] OTP: ${otpCode} to Mobile: ${target10DigitPhone}`);
        const twoFactorUrl = `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/${target10DigitPhone}/${encodeURIComponent(otpCode)}`;
        const response = await fetch(twoFactorUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        console.log("[2Factor.in API Response]", data);
        if (data && (data.Status === "Success" || data.status === "Success")) {
          return res.json({
            success: true,
            mode: "2factor",
            requestId: data.Details || data.details || `2F-${Date.now()}`,
            recipient: `+91 ${target10DigitPhone}`,
            message: `SMS OTP successfully sent to +91 ${target10DigitPhone} via 2Factor.in`
          });
        } else {
          return res.status(400).json({
            success: false,
            error: data.Details || data.details || data.Message || "2Factor.in API returned failure. Please check your API key or account balance.",
            raw: data
          });
        }
      } else {
        console.warn("[2Factor.in] Missing or incomplete TWOFACTOR_API_KEY.");
        return res.json({
          success: true,
          mode: "simulated",
          recipient: `+91 ${target10DigitPhone}`,
          otpCode,
          message: `[Dev / Simulated Mode] OTP code is ${otpCode}. Set TWOFACTOR_API_KEY in environment or modal to send real SMS via 2Factor.in.`
        });
      }
    } catch (err) {
      console.error("[2Factor.in Error]", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to communicate with 2Factor.in API Gateway",
        details: err.toString()
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
