async function main() {
  const [deployer] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("Proof");
  const contract = await Factory.deploy();

  await contract.waitForDeployment();

  console.log("Deployed:", await contract.getAddress());
}

main();