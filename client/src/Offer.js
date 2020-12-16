import React from 'react';
import { Row, Col, Table } from 'reactstrap';

const Offer = (props) => {
  const { data } = props;
  
  if (!data)
    return <div></div>;

  return (
    <Row className="offer">
      <Col sm="16" md={{ size: 6, offset: 3 }}>
        <h2>Offer: {data.offerName}</h2>
        <Table>
          <tbody>
            <tr>
              <td>Offer ID</td>
              <td>{data.offerId}</td>
            </tr>
            <tr>
              <td>Offer name</td>
              <td>{data.offerName}</td>
            </tr>
            {data.transactions.map(((transaction, i) =>
            <tr key={i}>  
                <td>Item Id:{transaction.itemId}</td>
                <td>{transaction.itemDelta}</td>
            </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default Offer;