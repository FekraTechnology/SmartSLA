pragma solidity ^0.4.2;
import "HelperLib.sol";

contract PayNowAlpha {
		//Incident Record Data structure
		struct incidentRecord {
			bytes32 sys_id;//incident sys_id in servicenow
			address requester;//requester address (mapped to user sys_id in servicenow)
			address fulfiller;//requester address (mapped to user sys_id in servicenow)
			bytes32 priority;//incidnet priority
			string currentState;//incidet current state
			uint stateUpdatedOn;//state last update timestamp
			bytes32 incidetCreatedOn;//incidnet creation timestamp
			uint stateChangesCounter;//incident state changes
			bytes32 incidetUpdatedOn;//incidnet last update timestamp
			mapping (uint => string) previousStates;//array of states mapped to timestamps
		}

	mapping (bytes32 => incidentRecord) public incidents;

	uint public numOfIncs;

	//create a new incidnet
	function createIncident(address _requester, bytes32 _sys_id, bytes32 _created) returns(bool success){
		incidents[_sys_id].sys_id = _sys_id;
		incidents[_sys_id].requester = _requester;
		incidents[_sys_id].incidetCreatedOn = _created;
		incidents[_sys_id].currentState = "open";
		numOfIncs += 1;

		return true;
	}

	//update an open incidnet
	function updateIncidentState(bytes32 _sys_id, string _newState) returns(bool success){
		incidents[_sys_id].stateChangesCounter += 1;
		incidents[_sys_id].previousStates[incidents[_sys_id].stateChangesCounter] = incidents[_sys_id].currentState;
		incidents[_sys_id].currentState = _newState;
		incidents[_sys_id].stateUpdatedOn = now;
		return true;
	}

	//read number of open incidnets
	function readOpenIncidents() constant returns(uint) {
		return numOfIncs;
	}

	//read an open incidnet state
	function readIncidentState(bytes32 _sys_id) constant returns(string) {
		return incidents[_sys_id].currentState;
	}

	//read an open incidnet timestamp
	function readIncidentCreatedOn(bytes32 _sys_id) constant returns(bytes32) {
		return incidents[_sys_id].incidetCreatedOn;
	}
	//read an open incidnet timestamp
	function readIncUpdatedOn(bytes32 _sys_id) constant returns(uint) {
		return incidents[_sys_id].stateUpdatedOn;
	}

}
