import React from 'react';
import { Row, Col, Table } from 'reactstrap';

const Item = (props) => {
  const { data } = props;
  
  console.log(data);

  if (!data)
    return <div></div>;

  return (
    <Row className="item">
      <Col sm="12" md={{ size: 4, offset: 4 }}>
        <h2>Item :{data[0].item_name}</h2>
        <Table>
          <tbody>
            <tr>
              <td>Item ID</td>
              {/* item id should be here */}
              <td>{data[0].id}</td>
            </tr>
            <tr>
              <td>Item name</td>
              {/* item name should be here */}
              <td>{data[0].item_name}</td>
            </tr>
            <tr>
              <td>Quantity</td>
              <td>{data[0].quantity}</td>
            </tr>
            <tr>
              <td>Max Quantity</td>
              {/* item max quantity should be here */}
              <td>{data[0].max_quantity}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default Item;