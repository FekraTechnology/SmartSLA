module.exports = function(deployer) {
  deployer.deploy(HelperLib);
  deployer.autolink();
  deployer.deploy(PayNowAlpha);
};
