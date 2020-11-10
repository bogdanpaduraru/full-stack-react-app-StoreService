import React, { Component } from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Item from './Item';
import Offer from'./Offer';

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       item: null,
       itemList: [],
       newItemName: '',
       itemQuantity: 1,
       itemMaxQuantity: 1,
       offer: null,
       offerList: [],
       newOfferName: ''
    };
  }

  getItemList = () => {
    fetch('/api/items')
    .then(res => res.json())
    .then(res => {
      var itemList = res.map(r => r.item_name);
      this.setState({ itemList });
    });
  };

  getOfferList = () => {
    fetch('/api/offers')
    .then(res => res.json())
    .then(res => {
      var offerList = res.map(r => r.offer_name);
      this.setState({ offerList });
    });
  };

  handleItemInputChange = (e) => {
    this.setState({ newItemName: e.target.value });
  };

  handleOfferInputChange = (e) => {
    this.setState({ newOfferName: e.target.value });
  };

  handleAddItem = () => {
    fetch('/api/items', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name: this.state.newItemName, quantity: this.state.itemQuantity, max_quantity: this.state.itemMaxQuantity })
    })
    .then(res => res.json())
    .then(res => {
      this.getItemList();
      this.setState({ newItemName: '' });
      this.setState({ itemQuantity: 1});
      this.setState({ itemMaxQuantity: 1 });
    });
  };

  handleAddOffer = () => {
    fetch('/api/offers', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_name: this.state.newOfferName })
    })
    .then(res => res.json())
    .then(res => {
      this.getOfferList();
      this.setState({ newOfferName: '' });
    });
  };

  getItem = (item_name) => {
    fetch(`/api/items/${item_name}`)
    .then(res => res.json())
    .then(item => {
      console.log(item);
      this.setState({ item });
    });
  }

  getOffer = (offer_name) => {
    fetch(`/api/offers/${offer_name}`)
    .then(res => res.json())
    .then(offer => {
      console.log(offer);
      this.setState({ offer });
    });
  }

  handleChangeItem = (e) => {
    console.log(e);
    this.getItem(e.target.value);
  }

  handleChangeOffer =(e) => {
    console.log(e);
    this.getOffer(e.target.value);
  }

  componentDidMount () {
    this.getItemList();
    this.getOfferList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">Store Service</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">Item Creator</h1>
              <InputGroup>
                <Input 
                  placeholder="New item name..."
                  value={this.state.newItemName}
                  onChange={this.handleItemInputChange}
                />
                <Input
                    placeholder="Quantity for this item..."
                    value={this.state.itemQuantity}
                    onChange={e => this.setState({ itemQuantity: e.target.value })}
                />
                <Input
                    placeholder="Max quantity for this item..."
                    value={this.state.itemMaxQuantity}
                    onChange={e => this.setState({ itemMaxQuantity: e.target.value })}
                />
                <InputGroupAddon addonType="append">
                  
                  <Button color="primary" onClick={this.handleAddItem}>Add Item</Button>
                </InputGroupAddon>
                
              </InputGroup>

              <Row>
                <Col>
                  <h1 className="display-5">All items</h1>
                  <FormGroup>
                    <Input type="select" onChange={this.handleChangeItem}>
                      { this.state.itemList.length === 0 && <option>No items added yet.</option> }
                      { this.state.itemList.length > 0 && <option>Select an item.</option> }
                      { this.state.itemList.map((item, i) => <option key={i}>{item}</option>) }
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Item data={this.state.item}/>

            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">Offer Creator</h1>
              <InputGroup>
                <Input 
                  placeholder="New offer name..."
                  value={this.state.newOfferName}
                  onChange={this.handleOfferInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddOffer}>Add offer</Button>
                </InputGroupAddon>
                
              </InputGroup>

              <Row>
                <Col>
                  <h1 className="display-5">All offers</h1>
                  <FormGroup>
                    <Input type="select" onChange={this.handleChangeOffer}>
                      { this.state.offerList.length === 0 && <option>No offers added yet.</option> }
                      { this.state.offerList.length > 0 && <option>Select an offer.</option> }
                      { this.state.offerList.map((offer, i) => <option key={i}>{offer}</option>) }
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Offer data={this.state.offer}/>

            </Jumbotron>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default App;
