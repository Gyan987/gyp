// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title BlockDare - Immutable challenge record for fair play
/// @author 
/// @notice This contract lets users create and record challenges on-chain permanently.
/// @dev Beginner-friendly example.

contract BlockDare {

    // Represents one challenge
    struct Challenge {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 timestamp;
        bool completed;
    }

    // Array of all challenges
    Challenge[] public challenges;

    // Event to log new challenge creation
    event ChallengeCreated(uint256 id, address indexed creator, string title);

    // Event to log challenge completion
    event ChallengeCompleted(uint256 id, address indexed completer);

    /// @notice Create a new challenge (stored immutably)
    /// @param _title Short title for the challenge
    /// @param _description Detailed description of the challenge
    function createChallenge(string memory _title, string memory _description) public {
        uint256 challengeId = challenges.length;

        challenges.push(Challenge({
            id: challengeId,
            creator: msg.sender,
            title: _title,
            description: _description,
            timestamp: block.timestamp,
            completed: false
        }));

        emit ChallengeCreated(challengeId, msg.sender, _title);
    }

    /// @notice Mark a challenge as completed (only creator can mark)
    /// @param _id ID of the challenge to mark complete
    function completeChallenge(uint256 _id) public {
        require(_id < challenges.length, "Challenge does not exist");
        Challenge storage c = challenges[_id];
        require(msg.sender == c.creator, "Only creator can complete their challenge");
        require(!c.completed, "Challenge already completed");

        c.completed = true;
        emit ChallengeCompleted(_id, msg.sender);
    }

    /// @notice Get total number of challenges
    function getTotalChallenges() public view returns (uint256) {
        return challenges.length;
    }

    /// @notice Fetch a challenge by ID
    function getChallenge(uint256 _id) public view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        uint256 timestamp,
        bool completed
    ) {
        require(_id < challenges.length, "Invalid challenge ID");
        Challenge memory c = challenges[_id];
        return (c.id, c.creator, c.title, c.description, c.timestamp, c.completed);
    }
}
