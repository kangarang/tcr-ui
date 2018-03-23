## Lifecycle of a Listing

Each `Listing` starts out in the **Application** stage.

* The owner of the `Listing` is called the "Applicant"
* Tokens sent by Applicant are called `application_deposit`
* `application_deposit` **>=** `min_deposit` (canonical parameter)
* The Applicant is allowed to increase the `application_deposit`

---

If _challenged_, a `Listing` moves into the **Voting** stage.

* The msg.sender of the _challenge_ is called the "Challenger"
* Tokens obtained from Challenger are called `challenge_stake`
* `challenge_stake` **===** `min_deposit` (canonical parameter)

---

The **Voting** stage consists of 2 sub-periods: _Commit_ and _Reveal_

* **Voting** can also be called **Faceoff**
* Participants _voting_ with tokens are called "Voters"
* Tokens used for _voting_ are called `voting_rights`
* Tokens are _locked_ during the `commit_period`
* Once the `commit_period` has ended and the `reveal_period` has begun, a Voter can "reveal" his secret vote to unveil the contents

---

If the majority of votes is FOR the Applicant's `Listing`, the `Listing` enters the **Registry** stage.

* Applicant's `application_deposit` stays with the `Listing`
* Challenger forfeits full `challenge_stake`
* Applicant receieves `%` of the Challenger's forfeited `challenge_stake`
* Voters in the `majority_bloc` are awarded the remaining tokens of the Challenger's forfeited `challenge_stake`, disbursed based on token-vote weight
* Voters in the `minority_bloc` are allowed to retreive `voting_rights`

If the majority of votes is AGAINST the `Listing`, the `Listing` is removed from the system.

* Challenger receives full `challenge_stake`
* Applicant forfeits `min_deposit` and receives `application_deposit` - `min_deposit` (extra tokens)
* Tokens that are to be forfeited by the Applicant are called `application_stake` (equal to `min_deposit`)
* Challenger receieves `%` of the Applicant's forfeited `application_stake`
* Voters in the `majority_bloc`, those who voted AGAINST the Applicant, are awarded the remaining tokens from the Applicant's forfeited `application_stake`, disbursed based on token-vote weight
* Voters in the `minority_bloc` are allowed to retreive tokens rights
