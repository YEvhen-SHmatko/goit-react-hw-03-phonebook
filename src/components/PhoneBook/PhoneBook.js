import React, { Component } from 'react';
import shortid from 'shortid';
import PNotify from 'pnotify/dist/es/PNotify';
import ContactForm from '../ContactForm/ContactForm';
import Filter from '../Filter/Filter';
import ContactList from '../ContactList/ContactList';
import Styles from './PhoneBook.module.css';

export default class PhoneBook extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  inputIds = {
    nameId: shortid.generate(),
    numberId: shortid.generate(),
    finedId: shortid.generate(),
  };

  componentDidMount() {
    if (localStorage.getItem('localState') !== null) {
      this.setState({
        contacts: JSON.parse(localStorage.getItem('localState')),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localStorage.setItem('localState', JSON.stringify(contacts));
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    const { contacts } = this.state;
    const { name } = e;
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      const message = `${name} is already is contacts`;
      PNotify.error({
        text: message,
      });
      return;
    }
    this.setState({
      contacts: [...contacts, e],
    });
  };

  deleteContact = e => {
    const { id } = e.target;
    const { contacts } = this.state;
    this.setState({ contacts: contacts.filter(contact => contact.id !== id) });
  };

  render() {
    const { contacts, filter } = this.state;
    const { nameId, numberId, finedId } = this.inputIds;
    const filterContacts = contacts.filter(contact => {
      const nameContact = contact.name;
      return nameContact.toLowerCase().includes(filter.toLowerCase());
    });
    return (
      <section className={Styles.section}>
        <h1 className={Styles.title}>Phonebook</h1>
        <ContactForm
          onSubmit={this.handleSubmit}
          htmlFor={{ nameId, numberId }}
        />
        <h2 className={Styles.subTitle}>Contacts</h2>
        <Filter onChange={this.handleChange} htmlFor={finedId} value={filter} />
        <ContactList
          filterContacts={filterContacts}
          onClickDelete={this.deleteContact}
        />
      </section>
    );
  }
}
