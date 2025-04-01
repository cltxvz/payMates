import React from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";

const BalanceSummary = ({ balances}) => {

  const userName = localStorage.getItem("userName")?.trim();
  const isLoaded = balances && Object.keys(balances).length > 0;

  // What the current user owes to others
  const userOwes = balances[userName] || {};

  // Who owes the current user
  const owedToUser = Object.entries(balances)
    .filter(([otherUser, debts]) => debts[userName])
    .map(([otherUser, debts]) => ({
      user: otherUser,
      amount: debts[userName]
    }));

  return (
    <Container className="mt-5">
      <h2 className="text-center">Your Balance Summary</h2>

      {!isLoaded && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Loading balance summary...</p>
        </div>
      )}

      {isLoaded && Object.keys(userOwes).length === 0 && owedToUser.length === 0 && (
        <Alert variant="info" className="text-center mt-3">
          No balance data available. Add or participate in transactions.
        </Alert>
      )}

      {Object.keys(userOwes).length > 0 && (
        <>
          <h5 className="mt-4">💸 You Owe</h5>
          <Table striped bordered hover className="mt-2">
            <thead>
              <tr>
                <th>To</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userOwes).map(([to, amount]) => (
                <tr key={to}>
                  <td>{to}</td>
                  <td>${amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {owedToUser.length > 0 && (
        <>
          <h5 className="mt-4">💰 Owed To You</h5>
          <Table striped bordered hover className="mt-2">
            <thead>
              <tr>
                <th>From</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {owedToUser.map(({ user, amount }) => (
                <tr key={user}>
                  <td>{user}</td>
                  <td>${amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default BalanceSummary;
