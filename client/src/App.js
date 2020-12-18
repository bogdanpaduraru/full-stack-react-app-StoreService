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

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


import Item from './Item';
import Offer from './Offer';

var Transaction = require('./models/Offer');

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       item: null,
       itemList: [],
       newItemName: '',
       offer: null,
       offerList: [],
       newOfferName: '',
       transactionItemId: '',
       transactionItemName: '',
       transactionItemDelta: 0,
       offerTransactions: [],
       inventoryItemId: '',
       inventoryItemQuantity: 0,
       inventoryItems: []
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
      var offerList = res.map(r => r.offerName);
      this.setState({ offerList });
    });
  };

  getInventoryList =() => {
    //TODO: change this const with actual profile of player when authentication is implemented
    const profile_id = '9782d9fa-d722-4bf5-9816-d489141998d8';
    fetch(`/api/inventory/${profile_id}`)
    .then(res => res.json())
    .then(res => {
      var inventoryItems = res;
      this.setState({ inventoryItems });
      this.displayCurrentInventoryTableData(this.state.inventoryItems);
    });
  }

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
      body: JSON.stringify({ item_name: this.state.newItemName, max_quantity: this.state.itemMaxQuantity })
    })
    .then(res => res.json())
    .then(res => {
      this.getItemList();
      this.setState({ newItemName: '' });
      this.setState({ itemMaxQuantity: 0 });
    });
  };

  handleAddOffer = () => {
    if(this.state.offerTransactions == undefined || this.state.offerTransactions.length == 0 || 
      this.state.offerName || this.state.newOfferName == '') {
        window.alert("Make sure offer has a name and at least 1 transaction!");
        return;
    }

    fetch('/api/offers', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_name: this.state.newOfferName, transactions: this.state.offerTransactions })
    })
    .then(res => res.json())
    .then(res => {
      this.getOfferList();
      this.setState({ newOfferName: '' });
      this.setState({ offerTransactions: [] });
      this.displayTransactionsTableData(this.state.offerTransactions);
    });
  };

  handleAddTransaction = () => {
    if(this.state.transactionItemId !== '') {
      var transaction = new Transaction(this.state.transactionItemId, this.state.transactionItemName, this.state.transactionItemDelta);
      this.state.offerTransactions.push(transaction);      
      this.displayTransactionsTableData(this.state.offerTransactions);
    }
    this.setState({ transactionItemId: ''});
    this.setState({ transactionItemDelta: 0 });
  }

  handleAddInventoryItem = () => {
    if(this.state.inventoryItemId !== '') {
      //TODO: change this const with actual profile of player when authentication is implemented
      const profile_id = '9782d9fa-d722-4bf5-9816-d489141998d8';

      fetch('/api/inventory', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: this.state.inventoryItemId, 
                                item_quantity: this.state.inventoryItemQuantity,
                                profile_id: profile_id })
      })
      .then(res => res.json())
      .then( res => {
        this.getInventoryList();
        this.setState({ inventoryItemId: '', inventoryItemQuantity: 0 });
      });
    }
  }

  handleUpdateInventoryItem = (item_id, item_quantity) => {
    //TODO: change this const with actual profile of player when authentication is implemented
    const profile_id = '9782d9fa-d722-4bf5-9816-d489141998d8';

    fetch('/api/inventory', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: item_id, 
                              item_quantity: item_quantity,
                              profile_id: profile_id })
    })
    .then(res => res.json())
    .then( res => {
      this.getInventoryList();
      this.setState({ inventoryItemId: '', inventoryItemQuantity: 0 });
      window.alert("Edit successful!");
    });
  }

  handleRemoveInventoryItem = (item_id) => {
    //TODO: change this const with actual profile of player when authentication is implemented
    const profile_id = '9782d9fa-d722-4bf5-9816-d489141998d8';

    fetch('api/inventory', {
      method: 'delete',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({ 
        item_id: item_id,
        profile_id:profile_id
      })
    })
    .then(res => res.json())
    .then(res => {
      this.getInventoryList();
      this.setState({ inventoryItemId: '', inventoryItemQuantity: 0 });
    });
  }

  getItem = (item_name) => {
    fetch(`/api/items/${item_name}`)
    .then(res => res.json())
    .then(item => {
      console.log(item);
      this.setState({ item });
    });
  }

  getItemForTransaction = (item_name) => {
    fetch(`/api/items/${item_name}`)
    .then(res => res.json())
    .then(item => {
      this.setState({ transactionItemId: item.id });
      this.setState({ transactionItemName: item.item_name });
    });
  }

  getItemForInventory = (item_name) => {
    fetch(`/api/items/${item_name}`)
    .then(res => res.json())
    .then(item => {
      this.setState({ inventoryItemId: item.id });
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
    this.getItem(e.target.value);
  }

  handleChangeTransactionItem = (e) => {
    if(e.target.value !== ''){
      this.getItemForTransaction(e.target.value);
    }
  }

  handleChangeInventoryItem = (e) => {
    if(e.target.value !== ''){
      this.getItemForInventory(e.target.value);
    }
  }

  handleChangeOffer =(e) => {
    console.log(e);
    this.getOffer(e.target.value);
  }

  componentDidMount () {
    this.getItemList();
    this.getOfferList();
    this.getInventoryList();
  }

  displayTransactionsTableData(objs){
    var row, cell, cell2, cell3;
    var tbody = document.querySelector('#transactionTable tbody');
    var cloneTbody = tbody.cloneNode(false);
    tbody.parentNode.replaceChild(cloneTbody, tbody);
    for(var i=0; i<objs.length; i++){
        row = cloneTbody.insertRow();
        cell = row.insertCell();
        cell.innerHTML = objs[i].itemName;
        
        cell2 = row.insertCell();
        cell2.innerHTML = objs[i].itemId;
        
        cell3 = row.insertCell();
        cell3.innerHTML = objs[i].itemDelta;
    }
}

displayCurrentInventoryTableData(objs){
  var row, editCell, cell2, itemIdCell, cell4, removeCell;
  var tbody = document.querySelector('#currentInventoryTable tbody');
  var cloneTbody = tbody.cloneNode(false);
  tbody.parentNode.replaceChild(cloneTbody, tbody);

  var handleUpdateInventoryItem = this.handleUpdateInventoryItem;
  var handleRemoveInventoryItem = this.handleRemoveInventoryItem;

  var handleEditInventoryRow = function(rowData){
    var itemIdCell = rowData.cells[2];
    var itemId = itemIdCell.innerHTML;

    var itemQuantityCell = rowData.cells[3];
    var itemQuantity = itemQuantityCell.getElementsByTagName('input')[0].value;

    handleUpdateInventoryItem(itemId, itemQuantity);
  }

  var handleRemoveInventoryRow = function(rowData){
    var itemIdCell = rowData.cells[2];
    var itemId = itemIdCell.innerHTML;

    handleRemoveInventoryItem(itemId);
  }

  for(var i=0; i<objs.length; i++){
      row = cloneTbody.insertRow();
      editCell = row.insertCell();
      var button=document.createElement("BUTTON");
      button.addEventListener('click',function(rowData){
        return function(){handleEditInventoryRow(rowData)}
      }(row));
      button.innerHTML= "Edit";
      editCell.style.padding = '8px';
      editCell.appendChild(button); // add child

      cell2 = row.insertCell();
      cell2.innerHTML = objs[i].item_name;
      cell2.style.padding = '8px';
      
      itemIdCell = row.insertCell();
      itemIdCell.innerHTML = objs[i].item_id;
      itemIdCell.style.padding = '8px';
      
      cell4 = row.insertCell();
      var inputQuantity = document.createElement("INPUT");
      inputQuantity.setAttribute("value", objs[i].item_quantity);
      inputQuantity.type = "number";
      inputQuantity.style.textAlign = "center";
      inputQuantity.style.width = '128px';
      cell4.style.padding = '8px';
      cell4.appendChild(inputQuantity);

      removeCell = row.insertCell();
      var removeButton = document.createElement("BUTTON");
      removeButton.addEventListener('click', function(rowData) {
        return function(){handleRemoveInventoryRow(rowData)}
      }(row));
      removeButton.innerHTML = "X";
      removeButton.style.background = 'red';
      removeButton.style.borderRadius = '4px';
      
      removeCell.appendChild(removeButton);
  }
}

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand>Store Service</NavbarBrand>
        </Navbar>

        <br/>

        <br/>

        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Home">
            Nothing to see here, this tab is <em>extinct</em>! 
          </Tab>

          <Tab eventKey="playerInventory" title="Player Inventory">
            <Jumbotron>
              <h1 className="display-3">Player inventory</h1>
              <div className="centered">
                <p> Current inventory </p>
              </div>
              
              <div className="center">
                <Row>
                  <table id="currentInventoryTable" border="2">
                    <thead>
                      <tr>
                        <th>Edit</th>
                        <th>Item name</th>
                        <th>Item ID</th>
                        <th>Quantity</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                  <tbody>
                  </tbody>
                  </table>
                </Row>
              </div>
              
              <br/>

              <div className="centered">
                <p> Add more items for this player </p>
              </div>

              <div className="inputCenter">
                <Row>
                  <Col>
                    <FormGroup>
                      <Input type="select" onChange={this.handleChangeInventoryItem}>
                        { this.state.itemList.length === 0 && <option>No available items yet.</option> }
                        { this.state.itemList.length > 0 && <option>Select an item.</option> }
                        { this.state.itemList.map((item, i) => <option key={i}>{item}</option>) }
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col>
                    <Input
                        placeholder="Quantity"
                        type="number"
                        value={this.state.inventoryItemQuantity}
                        onChange={e => this.setState({ inventoryItemQuantity: e.target.value })}
                    />
                  </Col>
                  <Col>
                    <InputGroupAddon addonType="append">
                      <Button color="primary" onClick={this.handleAddInventoryItem}>Add item</Button>
                    </InputGroupAddon>
                  </Col>
                </Row>
              </div>
              

            </Jumbotron>
          </Tab>

          <Tab eventKey="itemCreator" title="Item Creator">
            <Jumbotron>
              <h1 className="display-4">Item Creator</h1>
              <InputGroup>
                <Input 
                  placeholder="New item name..."
                  value={this.state.newItemName}
                  onChange={this.handleItemInputChange}
                />
                <Input
                    placeholder="Max quantity for this item..."
                    value={this.state.itemMaxQuantity}
                    type="number"
                    onChange={e => this.setState({ itemMaxQuantity: e.target.value })}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddItem}>Add Item</Button>
                </InputGroupAddon>
                
              </InputGroup>

              <br/>

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
          </Tab>
          <Tab eventKey="offerCreator" title="Offer Creator">
            <Jumbotron>
              <h1 className="display-3">Offer Creator</h1>
              <Input 
                  placeholder="New offer name..."
                  value={this.state.newOfferName}
                  onChange={this.handleOfferInputChange}
              />
              <br/>
              <p>Offer Transactions</p>
              <table id="transactionTable" border="2" className="center">
                <thead>
                  <tr>
                    <th>Item name</th>
                    <th>Item ID</th>
                    <th>Item delta</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
              
              <br/>

              <Row>
                <Col>
                  <FormGroup>
                    <Input type="select" onChange={this.handleChangeTransactionItem}>
                      { this.state.itemList.length === 0 && <option>No available items yet.</option> }
                      { this.state.itemList.length > 0 && <option>Select an item.</option> }
                      { this.state.itemList.map((item, i) => <option key={i}>{item}</option>) }
                    </Input>
                  </FormGroup>
                </Col>
                <Col>
                  <Input
                      placeholder="Item delta"
                      value={this.state.transactionItemDelta}
                      type="number"
                      onChange={e => this.setState({ transactionItemDelta: e.target.value })}
                  />
                </Col>
                <Col>
                  <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={this.handleAddTransaction}>Add transaction</Button>
                  </InputGroupAddon>
                </Col>
              </Row>
                
              <Button color="primary" onClick={this.handleAddOffer}>Add offer</Button>

              <br></br>
              <row>
                <br></br>
              </row>
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
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled>
            See ya later, <em>Alligator</em>! 
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default App;
