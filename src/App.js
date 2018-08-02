import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class EditContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      phoneNumber: this.props.phoneNumber,
      birthday: this.props.birthday
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var self = this;
    axios.post('/editContact', {
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      birthday: this.state.birthday,
      index: this.props.index
    }).then(function(res) {
      self.props.updateEditedContact(res.data[0]);
    });
    this.props.editContact();
  }

  render() {
    return(
      <div style={{margin: 10}}>
        <form onSubmit={(e)=>this.handleSubmit(e)} style={{display: 'block', justifyContent: 'space-evenly'}}>
          <div>
            <label>Name: </label>
            <input onChange={(e)=>{this.setState({name: e.target.value})}} type="text" value={this.state.name}/>
          </div>
          <div>
            <label>Phone Number: </label>
            <input onChange={(e)=>{this.setState({phoneNumber: e.target.value})}} type="text" value={this.state.phoneNumber}/>
          </div>
          <div>
            <label>Birthday: </label>
            <input onChange={(e)=>{this.setState({birthday: e.target.value})}} type="text" value={this.state.birthday}/>
          </div>
          <input type="submit" value="Edit Contact"/>
        </form>
      </div>
    );
  }
}

class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phoneNumber: '',
      birthday: ''
    }
  }

  handleSubmit(e) {
    var self = this;
    e.preventDefault();
    axios.post('/newcontact', {
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      birthday: this.state.birthday
    }).then(function(res) {
      self.props.addContact(res.data);
    })
    this.setState({
      name: '',
      phoneNumber: '',
      birthday: ''
    })
  }

  render() {
    return(
      <div style={{margin: 10}}>
        <form onSubmit={(e)=>this.handleSubmit(e)} style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <label>Name:</label>
          <input onChange={(e)=>{this.setState({name: e.target.value})}} type="text" value={this.state.name}/>
          <label>Phone Number:</label>
          <input onChange={(e)=>{this.setState({phoneNumber: e.target.value})}} type="text" value={this.state.phoneNumber}/>
          <label>Birthday:</label>
          <input onChange={(e)=>{this.setState({birthday: e.target.value})}} type="text" value={this.state.birthday}/>
          <input type="submit" value="Add Contact"/>
        </form>
      </div>
    );
  }
}

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    }
  }

  editContact() {
    this.setState({
      edit: !this.state.edit
    })
  }

  deleteContact() {
    var self = this;
    axios.post('/deleteContact', {
      index: this.props.index
    }).then(function(res) {
      self.props.updateDeletedContact(res.data[0]);
    })
  }

  render() {
    return(
      <div style={{border: '1px solid black', width: 500}}>
        <pre style={{alignItems: 'center', fontFamily: 'Helvetica', display: 'flex', justifyContent: 'space-between'}}>
          <div style={{display: 'block', marginLeft: 20}}>
            <div>
              Name: {this.props.item.name}
            </div>
            <div>
              Phone Number: {this.props.item.phoneNumber}
            </div>
            <div>
              Birthday: {this.props.item.birthday}
            </div>
          </div>

          <div style={{marginRight: 20}}>
            <button onClick={()=>this.editContact()} style={{fontSize: 15}}>Edit</button>
            <button onClick={()=>this.deleteContact()} style={{fontSize: 15}}>Delete</button>
          </div>
        </pre>
        <div style={{width: '100%'}}>
          {this.state.edit ? (<EditContact editContact={()=>this.editContact()} updateEditedContact={(list)=>this.props.updateEditedContact(list)} index={this.props.index} name={this.props.item.name} phoneNumber={this.props.item.phoneNumber} birthday={this.props.item.birthday}/>) : (<p></p>)}
        </div>

      </div>
    );
  }
}





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      search: ''
    }
  }

  componentDidMount() {
    var self = this;
    axios.get('/contactlist')
    .then(function(res) {
      return res.data;
    }).then(function(res) {
      self.setState({
        contacts: res[0].users
      });
    })
  }

  addContact(user) {
    var arr = this.state.contacts.slice();
    arr.push(user);
    this.setState({
      contacts: arr
    })
  }

  updateEditedContact(arr) {
    this.setState({
      contacts: arr.users
    })
  }

  updateDeletedContact(arr) {
    this.setState({
      contacts: arr.users
    })
  }

  handleSearch(e) {
    var self = this;
    e.persist();
    var search = e.target.value
    this.setState({
      search: e.target.value
    })
    axios.get('/contactlist')
    .then(function(res) {
      return res.data;
    }).then(function(res) {
      self.setState({
        contacts: res[0].users.filter((item) => (item.name.indexOf(search) !== -1))
      });
    })

  }

  render() {
    return (
      <div style={{padding: 20, justifyContent: 'center', flex: 1}}>
        <h1 style={{display: 'flex', justifyContent: 'center'}}>Contact List</h1>

        <div style={{margin: 20, justifyContent: 'center', display: 'flex'}}>
          <label style={{marginRight: 5}}>Search: </label>
          <input onChange={(e)=> (this.handleSearch(e))} type="text" value={this.state.search}/>
        </div>

        <div style={{margin: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {this.state.contacts.map((item, index) => (<Contact updateEditedContact={(list)=>this.updateEditedContact(list)} updateDeletedContact={(list)=>this.updateDeletedContact(list)} index={index} key={index} item={item}/>))}
        </div>

        <div style={{margin: 20}}>
          <AddContact addContact={(users)=>this.addContact(users)}/>
        </div>


      </div>
    );
  }
}

export default App;
