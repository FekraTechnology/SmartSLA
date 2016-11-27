contract paynowscv1 {
  event newBusUsrCreated(address newBusUsraddress, address addr);
  function newBusUsr(string busUsrId) {
    if (msg.value > 0) throw;
      newBusUsrCreated(sthg here, msg.sender);
  }
  function () { throw; }
}
