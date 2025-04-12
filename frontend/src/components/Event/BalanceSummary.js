import React, { useState } from "react";
import { Table, Container, Alert, Spinner, Form } from "react-bootstrap";

const BalanceSummary = ({ balances, transactions, userName, onMarkPaid, isLoading }) => {
  const [marking, setMarking] = useState(false);

  const userOwes = balances[userName] || {};

  const owedToUser = Object.entries(balances)
    .filter(([otherUser, debts]) => debts[userName])
    .map(([otherUser, debts]) => ({
      user: otherUser,
      amount: debts[userName],
    }));

  const hasPaid = (transactionId) => {
    const tx = transactions.find((tx) => tx._id === transactionId);
    return tx?.paidBy?.includes(userName);
  };

  const handleMarkPaid = async (transactionId) => {
    setMarking(true);
    await onMarkPaid(transactionId);
    setMarking(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Your Balance Summary</h2>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Loading balance summary...</p>
        </div>
      ) : Object.keys(userOwes).length === 0 && owedToUser.length === 0 ? (
        <Alert variant="info" className="text-center mt-3">
          No balance data available. Add or participate in transactions.
        </Alert>
      ) : (
        <>
          {/* You Owe */}
          {Object.keys(userOwes).length > 0 && (
            <>
              <h5 className="mt-4">💸 You Owe</h5>
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(userOwes).map(([to, amount]) => {
                    const relatedTx = transactions.find(
                      (tx) => tx.payer === to && tx.splitAmong[userName]
                    );

                    const txId = relatedTx?._id;
                    const isPaid = hasPaid(txId);

                    return (
                      <tr key={to}>
                        <td>{to}</td>
                        <td>${amount.toFixed(2)}</td>
                        <td>
                          {txId ? (
                            <Form.Check
                              type="checkbox"
                              label="Mark Paid"
                              checked={isPaid}
                              disabled={marking}
                              onChange={() => handleMarkPaid(txId)}
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}

          {/* Owed To You */}
          {owedToUser.length > 0 && (
            <>
              <h5 className="mt-4">💰 Owed To You</h5>
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {owedToUser.map(({ user, amount }) => {
                    const relatedTx = transactions.find(
                      (tx) => tx.payer === userName && tx.splitAmong[user]
                    );

                    const hasPaid = relatedTx?.paidBy?.includes(user);

                    return (
                      <tr key={user}>
                        <td>{user}</td>
                        <td>${amount.toFixed(2)}</td>
                        <td>
                          {relatedTx ? (
                            hasPaid ? (
                              <span className="text-success">Paid</span>
                            ) : (
                              <span className="text-danger">Not Paid</span>
                            )
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default BalanceSummary;
