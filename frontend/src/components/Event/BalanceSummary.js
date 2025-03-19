import React from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";

const BalanceSummary = ({ balances, userName }) => {
  // Check if balance data is fully loaded
  const isBalanceLoaded = Object.keys(balances).length > 0;
  const userBalance = balances[userName];

  return (
    <Container className="mt-4">
      <h2 className="text-center">Balance Summary</h2>

      {/* Show loading spinner while balance data is being fetched */}
      {!isBalanceLoaded && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading balance...</span>
          </Spinner>
        </div>
      )}

      {/* If balance data is loaded but the user has no transactions */}
      {isBalanceLoaded && userBalance === undefined && (
        <Alert variant="info" className="text-center">
          No balance data available. Add or participate in transactions.
        </Alert>
      )}

      {/* User-specific balance */}
      {isBalanceLoaded && userBalance !== undefined && (
        <Alert variant={userBalance < 0 ? "danger" : "success"} className="text-center">
          {userBalance < 0
            ? `You owe $${Math.abs(userBalance)} in total`
            : `You should receive $${userBalance} in total`}
        </Alert>
      )}

      {/* Full balance summary */}
      {isBalanceLoaded && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(balances).map((user) => (
              <tr key={user} className={balances[user] < 0 ? "table-danger" : "table-success"}>
                <td>{user}</td>
                <td>{balances[user] < 0 ? `Owes $${Math.abs(balances[user])}` : `Receives $${balances[user]}`}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default BalanceSummary;
