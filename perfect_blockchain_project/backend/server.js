const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

// 🔥 CONNECT TO HARDHAT NODE
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// 🔥 USE DEFAULT HARDHAT ACCOUNT (NO PRIVATE KEY NEEDED)
const wallet = provider.getSigner(0);

// 🔥 CONTRACT ADDRESS (PASTE YOUR LATEST DEPLOYED ADDRESS HERE)
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// 🔥 CONTRACT ABI
const abi = [
  "function storeHash(string memory hash) public returns(uint)",
  "function getHash(uint id) public view returns(string memory)"
];

// 🔥 CONNECT CONTRACT
const contract = new ethers.Contract(contractAddress, abi, wallet);

// 🔥 SEND MESSAGE
app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const hash = crypto.createHash("sha256").update(message).digest("hex");

    console.log("Message:", message);
    console.log("Hash:", hash);

    const tx = await contract.storeHash(hash);
    await tx.wait();

    const id = messages.length;
    messages.push({ id, message, hash });

    res.json({ id, message });

  } catch (err) {
    console.error("SEND ERROR:", err);
    res.status(500).json({ error: "Send failed" });
  }
});

// 🔥 GET MESSAGES
app.get("/messages", (req, res) => {
  res.json(messages);
});

// 🔥 VERIFY MESSAGE
app.post("/verify", async (req, res) => {
  try {
    const { id, message } = req.body;

    const newHash = crypto.createHash("sha256").update(message).digest("hex");

    const stored = await contract.getHash(id);

    res.json({ verified: stored === newHash });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// 🚀 START SERVER
app.listen(5001, () => console.log("Backend running on 5001"));