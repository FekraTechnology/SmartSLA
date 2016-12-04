pragma solidity ^0.4.2;
import "HelperLib.sol";

contract PayNowAlpha {
		//Task Record Data structure
		struct TaskRecord {
			address requester;//requester address (mapped to user sys_id in servicenow)
			address fulfiller;//fulfiller address (mapped to user sys_id in servicenow)
			bytes32 priority;//priority enum
			bytes32 currentState;//current state enum
			bytes32 stateUpdatedOn;//state last update timestamp
			bytes32 createdOn;//creation timestamp
			bytes32 incidetUpdatedOn;//last update timestamp

			previousStates[];//array of states mapped to timestamps
		}

	mapping (bytes32 => TaskRecord) public tasks;

	uint public numOfIncs;

	//create a new task
	function createTask(address _requester, bytes32 _sys_id, bytes32 _created) returns(bool success){
		tasks[_sys_id].requester = _requester;
		tasks[_sys_id].incidetCreatedOn = _created;
		tasks[_sys_id].currentState = "open";
		numOfIncs += 1;

		return true;
	}

	//create a new task
	//TODO: lookup agreement costing model to determine task deposit based on priority
	//TODO: what else do we need to calculate the deposit?
	function calculateTaskDeposit(bytes32 priority) returns(bytes31 deposit){
		if(priority="High") {return "9"};
		else if(priority="Mideum") {return "8"};
		else if (priority="Low") {return "7"};
		return true;
	}

	//update an open task
	function updateTaskState(bytes32 _sys_id, string _newState) returns(bool success){
		Tasks[_sys_id].stateChangesCounter += 1;
		Tasks[_sys_id].previousStates[Tasks[_sys_id].stateChangesCounter] = Tasks[_sys_id].currentState;
		Tasks[_sys_id].currentState = _newState;
		Tasks[_sys_id].stateUpdatedOn = now;
		return true;
	}

	//read number of open tasks
	function readOpenTasks() constant returns(uint) {
		return numOfIncs;
	}

	//read an open task state
	function readTaskState(bytes32 _sys_id) constant returns(string) {
		return Tasks[_sys_id].currentState;
	}

	//read an open task timestamp
	function readTaskCreatedOn(bytes32 _sys_id) constant returns(bytes32) {
		return Tasks[_sys_id].incidetCreatedOn;
	}
	//read an open task timestamp
	function readIncUpdatedOn(bytes32 _sys_id) constant returns(uint) {
		return Tasks[_sys_id].stateUpdatedOn;
	}

}
